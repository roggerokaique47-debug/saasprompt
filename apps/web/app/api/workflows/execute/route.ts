import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { executions } from '@prompthub/database/src/schema/executions';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { usageLogs } from '@prompthub/database/src/schema/usage_logs';
import { eq, sql } from 'drizzle-orm';
import { inngest } from '@/lib/inngest';

import { ExecuteWorkflowSchema } from '@prompthub/shared/src/validations/apiSchema';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = ExecuteWorkflowSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
  }

  const { workflowId, trigger, agentId } = parsed.data;

  // 1. Validar posse do Workflow (Zero Trust) e recuperar Organization
  const [workflow] = await db
    .select({ 
      id: workflows.id, 
      authorId: workflows.authorId, 
      organizationId: workflows.organizationId, 
      workflowJson: workflows.workflowJson 
    })
    .from(workflows)
    .where(eq(workflows.id, workflowId))
    .limit(1);

  if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  if (workflow.authorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // 2. Validação de Cotas da Organização (Billing Hard Limit)
  const [org] = await db
    .select({ id: organizations.id, plan: organizations.plan, credits: organizations.credits })
    .from(organizations)
    .where(eq(organizations.id, workflow.organizationId))
    .limit(1);

  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });

  // Bloqueio de Execução para planos esgotados
  if (org.credits <= 0 && org.plan === 'free') {
    return NextResponse.json(
      { error: 'Quota exceeded. Please upgrade your plan to continue executing workflows.' },
      { status: 402 }
    );
  }

  // 3. Cobrança Atômica de Créditos (Evita Race Condition)
  await db.update(organizations)
    .set({ credits: sql`${organizations.credits} - 1` })
    .where(eq(organizations.id, org.id));

  // 4. Registro formal de consumo (Audit Log)
  await db.insert(usageLogs).values({
    organizationId: org.id,
    workflowId: workflow.id,
    action: 'workflow_execution',
    creditsSpent: 1,
  });

  // 5. Criar registro de execução ('pending')
  const [execution] = await db.insert(executions).values({
    workflowId: workflow.id,
    agentId: agentId ?? null, // Propagar identidade do Agente se existir
    userId: user.id,
    organizationId: org.id,
    status: 'pending',
    trigger,
  }).returning();

  // 6. Enfileirar no Inngest (Assíncrono)
  await inngest.send({
    name: 'workflow/execute',
    data: {
      workflowId: workflow.id,
      agentId: agentId ?? null,
      userId: user.id,
      organizationId: org.id,
      executionId: execution.id,
      trigger,
      workflowJson: workflow.workflowJson as Record<string, unknown>,
    },
  });

  // HTTP 202 Accepted — job enfileirado, não concluído
  return NextResponse.json(
    {
      queued: true,
      executionId: execution.id,
      message: 'Workflow enfileirado. Acompanhe o status em tempo real.',
    },
    { status: 202 }
  );
}
