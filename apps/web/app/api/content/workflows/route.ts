import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const tagsRaw = (formData.get('tags') as string) || '';
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

    const title = formData.get('title') as string;
    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    let workflowJson: any;
    try {
      workflowJson = JSON.parse(formData.get('workflowJson') as string);
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    // Obter ou criar org do usuário
    const { organizations } = await import('@prompthub/database/src/schema/organizations');
    const { eq } = await import('drizzle-orm');
    let [org] = await db.select().from(organizations).where(eq(organizations.ownerId, user.id)).limit(1);
    if (!org) {
      [org] = await db.insert(organizations).values({
        name: 'My Workspace',
        slug: `workspace-${user.id.slice(0, 8)}`,
        ownerId: user.id,
      }).returning();
    }

    await db.insert(workflows).values({
      organizationId: org.id,
      title,
      slug: uniqueSlug,
      description: (formData.get('description') as string) || null,
      workflowJson,
      authorId: user.id,
      isPremium: formData.has('isPremium'),
      priceCents: Number(formData.get('priceCents')) || 0,
      isPublished: false, // needs moderation
      tags,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Workflow create error:', error);
    return NextResponse.json({ error: 'Erro ao criar workflow' }, { status: 500 });
  }
}
