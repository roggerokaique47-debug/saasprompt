import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, and, desc } from 'drizzle-orm';
import { checkRateLimit } from '@prompthub/shared/src/rate-limit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Rate Limiting (Opcional, pois middleware já faz isso globalmente)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`marketplace_${ip}`, 50, '1 m');
    
    if (!rateLimit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Builder de queries
    const conditions = [
      eq(workflows.isPublished, true),
      eq(workflows.isActive, true)
    ];

    if (category) {
      // requires join with workflowCategories in a real complex scenario
      // For now, we assume frontend passes categoryId if needed or we expand this later
      // conditions.push(eq(workflows.categoryId, category));
    }

    const publicWorkflows = await db
      .select({
        id: workflows.id,
        title: workflows.title,
        slug: workflows.slug,
        description: workflows.description,
        authorId: workflows.authorId,
        downloads: workflows.downloads,
        ratingAvg: workflows.ratingAvg,
        priceCents: workflows.priceCents,
        isPremium: workflows.isPremium,
        tags: workflows.tags,
        createdAt: workflows.createdAt,
      })
      .from(workflows)
      .where(and(...conditions))
      .orderBy(desc(workflows.downloads)) // Por padrão ordena por mais baixados
      .limit(50); // Paginação inicial

    return NextResponse.json({ data: publicWorkflows });
  } catch (error) {
    console.error('Error fetching marketplace workflows:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
