import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { workflowReviews } from '@prompthub/database/src/schema/workflow_reviews';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating inválido (deve ser entre 1 e 5).' }, { status: 400 });
    }

    // Autenticação Real B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const userId = user.id;

    // 1. Insere o review
    await db.insert(workflowReviews).values({
      workflowId: id,
      userId,
      rating,
      comment,
    });

    // 2. Atualiza a média de avaliações do workflow
    const allReviews = await db
      .select({ rating: workflowReviews.rating })
      .from(workflowReviews)
      .where(eq(workflowReviews.workflowId, id));

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Math.round(totalRating / allReviews.length) : 0;

    await db.update(workflows)
      .set({ ratingAvg: avgRating })
      .where(eq(workflows.id, id));

    // Gamificação: Opcionalmente dar pontos ao criador do workflow por receber um review positivo
    if (rating >= 4) {
      const workflowResult = await db.select({ authorId: workflows.authorId }).from(workflows).where(eq(workflows.id, id)).limit(1);
      if (workflowResult.length > 0) {
        await db.update(users)
          .set({ points: sql`${users.points} + 10` }) // Dá 10 pontos ao criador
          .where(eq(users.id, workflowResult[0].authorId));
      }
    }

    return NextResponse.json({ success: true, avgRating });

  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Falha ao salvar a avaliação', details: (error as Error).message },
      { status: 500 }
    );
  }
}
