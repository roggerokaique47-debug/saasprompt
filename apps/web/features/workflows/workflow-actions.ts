'use server';

import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { executions } from '@prompthub/database/src/schema/executions';
import { eq, desc } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { WorkflowDefinition } from '@prompthub/engine';

export async function saveWorkflow(data: {
  id?: string;
  title: string;
  description?: string;
  workflowJson: WorkflowDefinition;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Usuário não autenticado' };

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (data.id) {
    const [existing] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, data.id))
      .limit(1);

    if (!existing) return { error: 'Workflow não encontrado' };
    if (existing.authorId !== user.id) return { error: 'Sem permissão' };

    await db.update(workflows)
      .set({
        title: data.title,
        description: data.description,
        workflowJson: data.workflowJson as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      })
      .where(eq(workflows.id, data.id));

    revalidatePath(`/workflows/${data.id}`);
    return { id: data.id };
  }

  const [workflow] = await db.insert(workflows).values({
    title: data.title,
    slug,
    description: data.description,
    workflowJson: data.workflowJson as unknown as Record<string, unknown>,
    authorId: user.id,
    isPublished: true,
  }).returning();

  revalidatePath('/workflows');
  return { id: workflow.id };
}

export async function getWorkflowExecutions(workflowId: string) {
  return db
    .select()
    .from(executions)
    .where(eq(executions.workflowId, workflowId))
    .orderBy(desc(executions.createdAt))
    .limit(20);
}

export async function getUserWorkflows() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return db
    .select({
      id: workflows.id,
      title: workflows.title,
      slug: workflows.slug,
      description: workflows.description,
      isPublished: workflows.isPublished,
      createdAt: workflows.createdAt,
      updatedAt: workflows.updatedAt,
    })
    .from(workflows)
    .where(eq(workflows.authorId, user.id))
    .orderBy(desc(workflows.updatedAt));
}

export async function runWorkflow(workflowId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Não autenticado' };

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/workflows/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflowId }),
  });

  const result = await response.json();
  if (!response.ok) return { error: result.error || 'Erro ao executar workflow' };

  revalidatePath(`/workflows/${workflowId}`);
  return { executionId: result.executionId, success: result.success };
}
