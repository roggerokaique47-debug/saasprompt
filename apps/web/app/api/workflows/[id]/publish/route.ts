import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { getUserPrimaryOrgId, requireOrgRole } from '@prompthub/shared/src/rbac/guard';
import { eq, and } from 'drizzle-orm';

/**
 * POST /api/workflows/[id]/publish
 * Publica ou despublica um workflow no Marketplace.
 * Exige: role 'editor' ou superior na organização.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workflowId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      return NextResponse.json({ error: 'Organização não encontrada.' }, { status: 403 });
    }

    // Exige role mínima de 'editor' para publicar/despublicar
    await requireOrgRole(user.id, organizationId, 'editor');

    const body = await request.json();
    const { publish, priceCents, categoryId, tags, description } = body;

    // Verificar se o workflow pertence à organização (Escudo Multi-tenant)
    const [existingWorkflow] = await db
      .select()
      .from(workflows)
      .where(
        and(
          eq(workflows.id, workflowId),
          eq(workflows.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!existingWorkflow) {
      return NextResponse.json(
        { error: 'Workflow não encontrado ou não pertence à sua organização.' },
        { status: 404 }
      );
    }

    const newPublishedState = publish !== undefined ? Boolean(publish) : !existingWorkflow.isPublished;
    const isPremium = (priceCents ?? existingWorkflow.priceCents) > 0;

    const [updatedWorkflow] = await db
      .update(workflows)
      .set({
        isPublished: newPublishedState,
        priceCents: priceCents !== undefined ? priceCents : existingWorkflow.priceCents,
        isPremium,
        categoryId: categoryId || existingWorkflow.categoryId,
        tags: tags || existingWorkflow.tags,
        description: description || existingWorkflow.description,
        updatedAt: new Date(),
      })
      .where(eq(workflows.id, workflowId))
      .returning();

    return NextResponse.json({
      success: true,
      isPublished: updatedWorkflow.isPublished,
      workflow: updatedWorkflow,
    });
  } catch (error: any) {
    if (error.message?.startsWith('INSUFFICIENT_ROLE')) {
      return NextResponse.json({ error: 'Permissão insuficiente para publicar workflows.' }, { status: 403 });
    }
    if (error.message === 'NOT_MEMBER') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }
    console.error('Error publishing workflow:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
