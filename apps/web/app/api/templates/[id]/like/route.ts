import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { templateLikes } from '@prompthub/database/src/schema/templates';
import { createClient } from '@/lib/supabase/server';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { id: templateId } = await params;

    // Verificar se já curtiu
    const existingLike = await db
      .select()
      .from(templateLikes)
      .where(and(eq(templateLikes.userId, userId), eq(templateLikes.templateId, templateId)))
      .limit(1);

    if (existingLike.length > 0) {
      // Se já existe, retira o like (Toggle)
      await db
        .delete(templateLikes)
        .where(eq(templateLikes.id, existingLike[0].id));
      return NextResponse.json({ liked: false });
    }

    // Se não existe, adiciona
    await db.insert(templateLikes).values({
      userId,
      templateId,
    });

    return NextResponse.json({ liked: true });
  } catch (error: any) {
    console.error('Error toggling template like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
