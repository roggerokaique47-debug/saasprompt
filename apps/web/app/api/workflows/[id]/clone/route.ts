import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Encontra o workflow original
    const workflowResult = await db.select().from(workflows).where(eq(workflows.id, id)).limit(1);
    
    if (workflowResult.length === 0) {
      return NextResponse.json({ error: 'Template não encontrado.' }, { status: 404 });
    }

    const originalWorkflow = workflowResult[0];

    // Autenticação Real B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const userId = user.id;

    // 2. Clona o workflow
    const newWorkflowId = uuidv4();
    const newTitle = `${originalWorkflow.title} (Clone)`;
    const newSlug = `${originalWorkflow.slug}-clone-${Date.now()}`;
    // Obter ou criar organização padrão
    const { organizations } = await import('@prompthub/database/src/schema/organizations');
    let [org] = await db.select().from(organizations).where(eq(organizations.ownerId, user.id)).limit(1);
    if (!org) {
      [org] = await db.insert(organizations).values({
        name: 'My Workspace',
        slug: `workspace-${user.id.slice(0,8)}`,
        ownerId: user.id,
      }).returning();
    }

    await db.insert(workflows).values({
      id: newWorkflowId,
      organizationId: org.id,
      title: newTitle,
      slug: newSlug,
      description: originalWorkflow.description,
      workflowJson: originalWorkflow.workflowJson,
      isActive: false, // Inativo por padrão até o usuário configurar
      categoryId: originalWorkflow.categoryId,
      authorId: userId,
      isPremium: false,
      isPublished: false, // É privado na conta do usuário
      tags: originalWorkflow.tags,
    });

    // 3. Incrementa o contador de downloads (clones) do original
    await db.update(workflows)
      .set({ downloads: sql`${workflows.downloads} + 1` })
      .where(eq(workflows.id, id));

    return NextResponse.json({ success: true, newWorkflowId });

  } catch (error) {
    console.error('Clone error:', error);
    return NextResponse.json(
      { error: 'Falha ao clonar o template', details: (error as Error).message },
      { status: 500 }
    );
  }
}
