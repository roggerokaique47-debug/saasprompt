import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { templateComments } from '@prompthub/database/src/schema/templates';
import { createClient } from '@/lib/supabase/server';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: templateId } = await params;
    const comments = await db
      .select()
      .from(templateComments)
      .where(eq(templateComments.templateId, templateId))
      .orderBy(desc(templateComments.createdAt))
      .limit(50);

    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('Error fetching template comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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

    const { id: templateId } = await params;
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const [newComment] = await db.insert(templateComments).values({
      userId: user.id,
      templateId,
      content: parsed.data.content,
    }).returning();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    console.error('Error adding template comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
