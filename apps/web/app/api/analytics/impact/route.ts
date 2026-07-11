import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { users } from '@prompthub/database/src/schema/users';
import { eq, and, sql, count, sum } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Escudo SaaS: Buscar organizationId do usuário logado (Isolamento B2B)
    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    const { organizationId } = dbUser;

    // Agregação principal: cruzar execuções com metadados de ROI do workflow
    // Apenas execuções com status 'completed' contam para o cálculo de ROI
    const impactRows = await db
      .select({
        totalExecutions: count(executions.id),
        totalTimeSavedMs: sum(workflows.estimatedTimeSavedMs),
        totalCostSavedCents: sum(workflows.estimatedCostSavedCents),
        totalCreditsSpent: sum(executions.creditsSpent),
      })
      .from(executions)
      .innerJoin(workflows, eq(executions.workflowId, workflows.id))
      .where(
        and(
          eq(executions.organizationId, organizationId),
          eq(executions.status, 'completed'),
        )
      );

    // Calcular taxa de sucesso
    const totalAllRows = await db
      .select({ total: count(executions.id) })
      .from(executions)
      .where(eq(executions.organizationId, organizationId));

    const totalAll = Number(totalAllRows[0]?.total ?? 0);
    const completed = Number(impactRows[0]?.totalExecutions ?? 0);
    const successRate = totalAll > 0 ? Math.round((completed / totalAll) * 100) : 0;

    const timeSavedMs = Number(impactRows[0]?.totalTimeSavedMs ?? 0);
    const timeSavedHours = Math.round((timeSavedMs / 1000 / 60 / 60) * 10) / 10;

    return NextResponse.json({
      success: true,
      data: {
        totalExecutions: totalAll,
        completedExecutions: completed,
        successRate,
        totalHoursSaved: timeSavedHours,
        totalMoneySavedCents: Number(impactRows[0]?.totalCostSavedCents ?? 0),
        totalCreditsSpent: Number(impactRows[0]?.totalCreditsSpent ?? 0),
      },
    });
  } catch (error) {
    console.error('[Analytics/Impact] Error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar métricas de impacto.' },
      { status: 500 }
    );
  }
}
