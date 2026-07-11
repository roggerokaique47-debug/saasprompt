import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { executionSteps } from '@prompthub/database/src/schema/execution_steps';
import { eq, and } from 'drizzle-orm';

import { ExecutionStepSchema } from '@prompthub/shared/src/validations/apiSchema';

/**
 * POST /api/executions/[id]/steps
 * Internal route — persists a single execution step (node) to the DB.
 * Called by the Inngest worker via onNodeStart and onNodeComplete callbacks.
 * Protected by x-internal-key header.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const internalKey = req.headers.get('x-internal-key');
  if (internalKey !== (process.env.INTERNAL_API_KEY || 'dev-key')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: executionId } = await params;
  
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = ExecutionStepSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
  }

  const { nodeId, nodeLabel, nodeType, status, input, output, error, durationMs, startedAt, completedAt } = parsed.data;

  try {
    // Fetch organizationId from execution
    const { executions } = await import('@prompthub/database/src/schema/executions');
    const [execution] = await db
      .select({ organizationId: executions.organizationId })
      .from(executions)
      .where(eq(executions.id, executionId))
      .limit(1);

    if (!execution?.organizationId) {
      return NextResponse.json({ error: 'Execução não encontrada ou sem organizationId' }, { status: 404 });
    }

    // Try to upsert: update if nodeId exists in this execution, insert otherwise
    const existing = await db
      .select({ id: executionSteps.id })
      .from(executionSteps)
      .where(and(eq(executionSteps.executionId, executionId), eq(executionSteps.nodeId, nodeId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(executionSteps)
        .set({
          status,
          output: output ?? null,
          error: error ?? null,
          durationMs: durationMs ?? null,
          startedAt: startedAt ? new Date(startedAt) : undefined,
          completedAt: completedAt ? new Date(completedAt) : undefined,
        })
        .where(and(eq(executionSteps.executionId, executionId), eq(executionSteps.nodeId, nodeId)));
    } else {
      await db.insert(executionSteps).values({
        organizationId: execution.organizationId,
        executionId,
        nodeId,
        nodeLabel: nodeLabel ?? nodeType,
        nodeType,
        status,
        input: input ?? null,
        output: output ?? null,
        error: error ?? null,
        durationMs: durationMs ?? null,
        startedAt: startedAt ? new Date(startedAt) : null,
        completedAt: completedAt ? new Date(completedAt) : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Steps API] Erro ao salvar step:', err);
    return NextResponse.json(
      { error: 'Falha ao persistir step', details: (err as Error).message },
      { status: 500 }
    );
  }
}
