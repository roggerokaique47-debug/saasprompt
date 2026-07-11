import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { nodeLogs } from '@prompthub/database/src/schema/node-logs';
import { usageLogs } from '@prompthub/database/src/schema/usage_logs';
import { eq } from 'drizzle-orm';

import { ExecutionUpdateSchema } from '@prompthub/shared/src/validations/apiSchema';

/**
 * POST /api/executions/[id]/update
 * 
 * Rota interna usada EXCLUSIVAMENTE pelo Inngest Worker para 
 * atualizar o banco de dados sem causar conflitos de múltiplas
 * instâncias do Drizzle ORM no Node.js.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: executionId } = await params;
  
  // Proteção simples para garantir que só o nosso sistema chame isso
  const internalKey = req.headers.get('x-internal-key');
  const expectedKey = process.env.INTERNAL_API_KEY || 'dev-key';
  
  if (internalKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = ExecutionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    if (data.status === 'running') {
      await db.update(executions)
        .set({ status: 'running' })
        .where(eq(executions.id, executionId));
      return NextResponse.json({ success: true });
    }

    // Se estiver finalizando, atualiza a execução e salva logs
    if (data.status === 'completed' || data.status === 'failed') {
      const executionResult = await db.update(executions)
        .set({
          status: data.status,
          results: data.results,
          durationMs: data.durationMs,
          completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        })
        .where(eq(executions.id, executionId))
        .returning();

      if (executionResult.length > 0 && data.nodeLogs && data.nodeLogs.length > 0) {
        const userId = executionResult[0].userId;

        // Salvar os logs de cada nó
        for (const nodeResult of data.nodeLogs) {
          await db.insert(nodeLogs).values({
            organizationId: executionResult[0].organizationId,
            executionId,
            nodeId: nodeResult.nodeId,
            nodeType: nodeResult.nodeType,
            status: nodeResult.status,
            output: nodeResult.output as Record<string, unknown>,
            error: nodeResult.error,
            durationMs: nodeResult.durationMs,
          });
        }

        // Calcular e descontar créditos para nós de IA
        const aiNodes = data.nodeLogs ? data.nodeLogs.filter(
          (r: any) => r.nodeType === 'openai' && r.status === 'success'
        ) : [];

        if (aiNodes.length > 0) {
          const totalTokens = aiNodes.reduce((acc: number, r: any) => {
            const usage = r.output?.usage;
            return acc + (usage?.total_tokens || 100);
          }, 0);

          // Buscar org do usuário para logar consumo corretamente
          const { organizations } = await import('@prompthub/database/src/schema/organizations');
          const { eq: eqOrg } = await import('drizzle-orm');
          const [org] = await db.select().from(organizations).where(eqOrg(organizations.ownerId, userId)).limit(1);

          if (org) {
            await db.insert(usageLogs).values({
              organizationId: org.id,
              action: 'workflow_execution',
              creditsSpent: Math.ceil(totalTokens / 1000), // 1 crédito por 1k tokens
              keyType: 'system',
            });
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    console.error('Error updating execution:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
