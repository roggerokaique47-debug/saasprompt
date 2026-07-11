import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, sql } from 'drizzle-orm';
import { InstallService } from '@prompthub/shared/src/marketplace/install-service';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await context.params;
    // Na prática, pegaríamos o usuário logado via middleware do Supabase Auth
    // const session = await getSession();
    // const organizationId = session.user.organizationId;
    
    // Para simplificar no MVP (Mock do ID autenticado simulado via Header ou Body):
    const organizationId = request.headers.get('x-organization-id');
    const userId = request.headers.get('x-user-id');

    if (!organizationId || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar o workflow original
    const [originalWorkflow] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, templateId))
      .limit(1);

    if (!originalWorkflow) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (!originalWorkflow.isPublished) {
      return NextResponse.json({ error: 'This workflow is not available in the marketplace' }, { status: 403 });
    }

    if (originalWorkflow.isPremium) {
      return NextResponse.json({ error: 'Premium templates require payment validation (Not implemented yet)' }, { status: 402 });
    }

    // Higienizar JSON
    const sanitizedJson = InstallService.sanitizeWorkflowJson(originalWorkflow.workflowJson);

    // Inserir clone no banco
    const [clonedWorkflow] = await db.insert(workflows).values({
      title: `${originalWorkflow.title} (Clone)`,
      slug: `${originalWorkflow.slug}-clone-${Date.now()}`,
      description: originalWorkflow.description,
      workflowJson: sanitizedJson,
      isActive: false, // Inicia desativado para o usuário configurar as próprias senhas
      categoryId: originalWorkflow.categoryId,
      authorId: userId, // Novo dono
      organizationId: organizationId, // Nova org
      isPublished: false, // É apenas um clone local
      isPremium: false,
    }).returning();

    // Incrementar os downloads do autor original de forma atômica
    await db
      .update(workflows)
      .set({ downloads: sql`${workflows.downloads} + 1` })
      .where(eq(workflows.id, originalWorkflow.id));

    return NextResponse.json({ success: true, workflow: clonedWorkflow });
  } catch (error) {
    console.error('Error installing template:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
