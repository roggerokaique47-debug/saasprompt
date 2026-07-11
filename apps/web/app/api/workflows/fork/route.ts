import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing workflow ID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Buscar o template original
    const originalResult = await db.select().from(workflows).where(eq(workflows.id, id)).limit(1);
    
    if (originalResult.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const original = originalResult[0];

    // 2. Incrementar downloads no template original
    await db.update(workflows)
      .set({ downloads: original.downloads + 1 })
      .where(eq(workflows.id, original.id));

    // 3. Criar uma cópia exata para o usuário atual
    // Usar um slug aleatório para evitar colisão
    const newSlug = `${original.slug}-fork-${Date.now()}`;
    // Obter ou criar organização padrão do usuário
    const { organizations } = await import('@prompthub/database/src/schema/organizations');
    let [org] = await db.select().from(organizations).where(eq(organizations.ownerId, user.id)).limit(1);
    if (!org) {
      [org] = await db.insert(organizations).values({
        name: 'My Workspace',
        slug: `workspace-${user.id.slice(0,8)}`,
        ownerId: user.id,
      }).returning();
    }

    const newWorkflowResult = await db.insert(workflows).values({
      organizationId: org.id,
      title: `${original.title} (Cópia)`,
      slug: newSlug,
      description: original.description,
      workflowJson: original.workflowJson,
      isActive: false, // Desativado por padrão
      authorId: user.id,
      isPublished: false, // O fork não é publicado por padrão
      priceCents: 0,
      isPremium: false
    }).returning({ id: workflows.id });

    const newWorkflowId = newWorkflowResult[0].id;

    // 4. Redirecionar direto para o editor do novo workflow
    return NextResponse.redirect(new URL(`/dashboard/workflows/${newWorkflowId}/edit`, req.url), 303);

  } catch (error) {
    console.error('Failed to fork workflow:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
