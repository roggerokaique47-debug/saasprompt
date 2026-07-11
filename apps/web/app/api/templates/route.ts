import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { workflowTemplates } from '@prompthub/database/src/schema/templates';
import { createClient } from '@/lib/supabase/server';
import { eq, desc, ilike, and } from 'drizzle-orm';
import { z } from 'zod';

const getTemplatesSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const conditions = [eq(workflowTemplates.isPublic, true)];

    if (category && category !== 'all') {
      conditions.push(eq(workflowTemplates.category, category));
    }

    if (search) {
      conditions.push(ilike(workflowTemplates.name, `%${search}%`));
    }

    const templates = await db
      .select()
      .from(workflowTemplates)
      .where(and(...conditions))
      .orderBy(desc(workflowTemplates.createdAt))
      .limit(50);

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
