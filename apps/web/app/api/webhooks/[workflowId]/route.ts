import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { executions } from '@prompthub/database/src/schema/executions';
import { nodeLogs } from '@prompthub/database/src/schema/node-logs';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq } from 'drizzle-orm';
import { executeWorkflow } from '@prompthub/engine';
import type { WorkflowDefinition } from '@prompthub/engine';
import { checkRateLimit } from '@prompthub/shared/src/rate-limit';

export async function POST(req: Request, context: { params: Promise<{ workflowId: string }> }) {
  const params = await context.params;
  const { workflowId } = params;
  const url = new URL(req.url);
  const agentId = url.searchParams.get('agentId') ?? undefined;

  if (!workflowId) return NextResponse.json({ error: 'workflowId required' }, { status: 400 });

  // Rate Limiting (Upstash Redis) -> Máx 100 requests por minuto por workflow
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const rateLimitResult = await checkRateLimit(`webhook_${workflowId}_${ip}`, 100, '1 m');
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, workflowId))
    .limit(1);

  if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  if (!workflow.isActive) return NextResponse.json({ error: 'Workflow is disabled' }, { status: 403 });

  // Escudo SaaS: Verificar se a organização tem créditos
  const [org] = await db.select().from(organizations).where(eq(organizations.id, workflow.organizationId)).limit(1);
  if (!org || org.credits < 1) {
    return NextResponse.json({ error: 'Insufficient credits on account' }, { status: 402 });
  }

  // Pega o body e injeta como payload no nó de webhook inicial (se existir)
  let bodyPayload = {};
  try {
    bodyPayload = await req.json();
  } catch (e) {
    // Pode não ser JSON
  }

  const definition = workflow.workflowJson as unknown as WorkflowDefinition;

  const [execution] = await db.insert(executions).values({
    organizationId: workflow.organizationId,
    workflowId: workflow.id,
    agentId: agentId ?? null, // Herdar identidade do Agente se existir
    userId: workflow.authorId, // O dono do workflow
    status: 'running',
    trigger: 'webhook',
  }).returning();

  try {
    // Injeta o payload inicial no context para ser usado pelo engine
    const engineContext = { userId: workflow.authorId, organizationId: workflow.organizationId, agentId, payload: bodyPayload };
    
    // O motor vai pegar a definição, o webhook é apenas um trigger que passa os dados.
    const result = await executeWorkflow(definition, engineContext);

    for (const nodeResult of result.results) {
      await db.insert(nodeLogs).values({
        organizationId: workflow.organizationId,
        executionId: execution.id,
        nodeId: nodeResult.nodeId,
        nodeType: nodeResult.nodeType,
        status: nodeResult.status,
        output: nodeResult.output as Record<string, unknown>,
        error: nodeResult.error,
        durationMs: nodeResult.durationMs,
      });
    }

    await db.update(executions)
      .set({
        status: result.success ? 'completed' : 'failed',
        results: result.results as unknown as Record<string, unknown>[],
        durationMs: result.totalDurationMs,
        completedAt: new Date(),
        creditsSpent: 1, // Webhook consumiu 1 token
      })
      .where(eq(executions.id, execution.id));

    // Escudo SaaS: Deduzir token da organização
    await db.update(organizations)
      .set({ credits: org.credits - 1 })
      .where(eq(organizations.id, workflow.organizationId));

    return NextResponse.json({ success: true, executionId: execution.id, results: result.results });
  } catch (error) {
    await db.update(executions)
      .set({
        status: 'failed',
        error: (error as Error).message,
        completedAt: new Date(),
      })
      .where(eq(executions.id, execution.id));

    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
