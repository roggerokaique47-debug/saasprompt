import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { agents } from '@prompthub/database/src/schema/agents';
import { users } from '@prompthub/database/src/schema/users';
import { eq, and, count, sum } from 'drizzle-orm';

/**
 * GET /api/analytics/agents
 * Retorna métricas de performance por Agente (Funcionário de IA) da organização.
 * Responde: qual funcionário executou mais, qual salvou mais tempo, qual falhou mais.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    // Buscar os agentes desta organização com métricas agregadas das execuções
    const agentRows = await db
      .select({
        agentId: agents.id,
        agentTitle: agents.title,
        totalRuns: count(executions.id),
        totalTimeSavedMs: sum(workflows.estimatedTimeSavedMs),
      })
      .from(agents)
      .leftJoin(executions, and(
        eq(executions.agentId, agents.id),
        eq(executions.status, 'completed'),
      ))
      .leftJoin(workflows, eq(executions.workflowId, workflows.id))
      .where(eq(agents.organizationId, organizationId))
      .groupBy(agents.id, agents.title);

    const formattedAgents = agentRows.map((row) => ({
      agentId: row.agentId,
      agentTitle: row.agentTitle,
      totalRuns: Number(row.totalRuns ?? 0),
      totalHoursSaved: Math.round((Number(row.totalTimeSavedMs ?? 0) / 1000 / 60 / 60) * 10) / 10,
    }));

    return NextResponse.json({ success: true, data: formattedAgents });
  } catch (error) {
    console.error('[Analytics/Agents] Error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar métricas dos agentes.' },
      { status: 500 }
    );
  }
}
