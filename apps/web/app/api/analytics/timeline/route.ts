import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { users } from '@prompthub/database/src/schema/users';
import { eq, and, gte, sql, count } from 'drizzle-orm';

/**
 * GET /api/analytics/timeline?period=7d|30d|90d
 * Retorna contagem de execuções agrupadas por dia para exibição em gráficos.
 * Isolado por organização (B2B).
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') ?? '30d';

    const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[period] ?? 30;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Escudo SaaS: Buscar organizationId do usuário logado
    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    const { organizationId } = dbUser;

    // Agregar execuções por dia (usando funções nativas do PostgreSQL)
    const rows = await db
      .select({
        day: sql<string>`DATE(${executions.startedAt})`.as('day'),
        completed: sql<number>`SUM(CASE WHEN ${executions.status} = 'completed' THEN 1 ELSE 0 END)`.as('completed'),
        failed: sql<number>`SUM(CASE WHEN ${executions.status} = 'failed' THEN 1 ELSE 0 END)`.as('failed'),
        total: count(executions.id),
      })
      .from(executions)
      .where(
        and(
          eq(executions.organizationId, organizationId),
          gte(executions.startedAt, cutoffDate),
        )
      )
      .groupBy(sql`DATE(${executions.startedAt})`)
      .orderBy(sql`DATE(${executions.startedAt}) ASC`);

    const timeline = rows.map((row) => ({
      day: row.day,
      completed: Number(row.completed),
      failed: Number(row.failed),
      total: Number(row.total),
    }));

    return NextResponse.json({ success: true, data: timeline, period });
  } catch (error) {
    console.error('[Analytics/Timeline] Error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar histórico de execuções.' },
      { status: 500 }
    );
  }
}
