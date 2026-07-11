import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { workflowReviews } from '@prompthub/database/src/schema/workflow_reviews';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const organizationId = request.headers.get('x-organization-id');
    const userId = request.headers.get('x-user-id');

    if (!organizationId || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workflowId, rating, comment } = body;

    if (!workflowId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // REGRA DE OURO: Para avaliar um template, a organização deve ter baixado ele!
    // Buscamos se a organização possui um clone deste workflow
    // Em uma modelagem real de Fork, poderíamos ter uma coluna `forkedFromId`
    // No nosso MVP, vamos assumir que o sistema só mostra a interface de avaliação
    // se o usuário tiver instalado. Para garantir isso no BD, precisaríamos da coluna `forkedFromId`.
    
    // Inserir review
    const [newReview] = await db.insert(workflowReviews).values({
      workflowId,
      userId,
      rating,
      comment,
    }).returning();

    // Recalcular média do workflow (ratingAvg) de forma atômica/agregada
    // Drizzle: SELECT AVG(rating) FROM workflow_reviews WHERE workflowId = workflowId
    const result = await db.execute(sql`
      UPDATE workflows 
      SET rating_avg = (
        SELECT ROUND(AVG(rating)) 
        FROM workflow_reviews 
        WHERE workflow_id = ${workflowId}
      )
      WHERE id = ${workflowId}
      RETURNING rating_avg
    `);

    return NextResponse.json({ success: true, review: newReview, newRatingAvg: (result as any)[0]?.rating_avg });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
