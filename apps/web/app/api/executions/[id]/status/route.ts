import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { nodeLogs } from '@prompthub/database/src/schema/node-logs';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/workflows/[id]/status
 * 
 * Retorna o status atual de uma execução de workflow.
 * Usado para polling no frontend enquanto aguarda a conclusão.
 * 
 * Em produção, preferir Supabase Realtime para evitar polling.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: executionId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Buscar a execução garantindo que pertence ao usuário logado (multi-tenant)
  const [execution] = await db
    .select()
    .from(executions)
    .where(
      and(
        eq(executions.id, executionId),
        eq(executions.userId, user.id)
      )
    )
    .limit(1);

  if (!execution) return NextResponse.json({ error: 'Execution not found' }, { status: 404 });

  // Se concluído, buscar os logs dos nós também
  let nodes: typeof nodeLogs.$inferSelect[] = [];
  if (execution.status === 'completed' || execution.status === 'failed') {
    nodes = await db
      .select()
      .from(nodeLogs)
      .where(eq(nodeLogs.executionId, executionId));
  }

  return NextResponse.json({
    id: execution.id,
    workflowId: execution.workflowId,
    status: execution.status,
    trigger: execution.trigger,
    durationMs: execution.durationMs,
    error: execution.error,
    startedAt: execution.startedAt,
    completedAt: execution.completedAt,
    nodeCount: nodes.length,
    nodes: nodes.map((n) => ({
      nodeId: n.nodeId,
      nodeType: n.nodeType,
      status: n.status,
      durationMs: n.durationMs,
      error: n.error,
    })),
  });
}
