import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { articles } from '@prompthub/database/src/schema/articles';

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

    await db.insert(articles).values({
      title,
      slug: uniqueSlug,
      description: (formData.get('description') as string) || null,
      content: formData.get('content') as string,
      categoryId: (formData.get('categoryId') as string) || null,
      authorId: user.id,
      contentType: (formData.get('contentType') as string) || 'article',
      isPremium: formData.has('isPremium'),
      priceCents: Number(formData.get('priceCents')) || 0,
      isPublished: false, // needs moderation
      tags,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Article create error:', error);
    return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 });
  }
}
