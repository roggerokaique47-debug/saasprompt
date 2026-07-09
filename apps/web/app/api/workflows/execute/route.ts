import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { executions } from '@prompthub/database/src/schema/executions';
import { nodeLogs } from '@prompthub/database/src/schema/node-logs';
import { eq } from 'drizzle-orm';
import { executeWorkflow } from '@prompthub/engine';
import type { WorkflowDefinition } from '@prompthub/engine';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { workflowId } = await req.json();
  if (!workflowId) return NextResponse.json({ error: 'workflowId required' }, { status: 400 });

  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, workflowId))
    .limit(1);

  if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  if (workflow.authorId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const definition = workflow.workflowJson as unknown as WorkflowDefinition;

  const [execution] = await db.insert(executions).values({
    workflowId: workflow.id,
    userId: user.id,
    status: 'running',
    trigger: 'manual',
  }).returning();

  try {
    const result = await executeWorkflow(definition);

    for (const nodeResult of result.results) {
      await db.insert(nodeLogs).values({
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
      })
      .where(eq(executions.id, execution.id));

    return NextResponse.json({ executionId: execution.id, ...result });
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
