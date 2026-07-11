import { AnalyticsClient, AiPromptBar } from "./client";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import db from '@prompthub/database/src/client';
import { purchases } from '@prompthub/database/src/schema/purchases';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { users } from '@prompthub/database/src/schema/users';
import { usageLogs } from '@prompthub/database/src/schema/usage_logs';
import { executions } from '@prompthub/database/src/schema/executions';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq, sum, count, and, gte, sql } from 'drizzle-orm';

export default async function AnalyticsDashboardPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  let userId = user?.id;
  if (!userId) {
     const testUsers = await db.select().from(users).limit(1);
     userId = testUsers[0]?.id;
  }
  
  if (!userId) return <div>No user found in database.</div>;

  // Buscar organizationId do usuário (Escudo SaaS B2B)
  const [dbUser] = await db
    .select({ organizationId: users.organizationId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const organizationId = dbUser?.organizationId;

  // 1. MRR
  const mrrResult = await db
    .select({ total: sum(purchases.amountCents) })
    .from(purchases)
    .where(eq(purchases.organizationId, organizationId!));
  const totalMrr = (Number(mrrResult[0]?.total) || 0) / 100;

  // 2. Workflows ativos na organização
  const workspacesResult = await db
    .select({ total: count() })
    .from(workflows)
    .where(eq(workflows.organizationId, organizationId!));
  const activeWorkspaces = workspacesResult[0]?.total || 0;

  // 3. API Calls (total de créditos gastos pela organização)
  let totalApiCalls = 0;
  if (organizationId) {
    const apiCallsResult = await db
      .select({ total: sum(usageLogs.creditsSpent) })
      .from(usageLogs)
      .where(eq(usageLogs.organizationId, organizationId));
    totalApiCalls = Number(apiCallsResult[0]?.total) || 0;
  }

  // 4. Métricas de ROI (Sprint 6) — Horas poupadas e taxa de sucesso
  let horasPoupadas = 0;
  let taxaSucesso = 0;
  if (organizationId) {
    const impactResult = await db
      .select({
        totalTimeSavedMs: sum(workflows.estimatedTimeSavedMs),
        completedCount: count(executions.id),
      })
      .from(executions)
      .innerJoin(workflows, eq(executions.workflowId, workflows.id))
      .where(and(
        eq(executions.organizationId, organizationId),
        eq(executions.status, 'completed'),
      ));

    const totalResult = await db
      .select({ total: count(executions.id) })
      .from(executions)
      .where(eq(executions.organizationId, organizationId));

    const completed = Number(impactResult[0]?.completedCount ?? 0);
    const total = Number(totalResult[0]?.total ?? 0);

    horasPoupadas = Math.round((Number(impactResult[0]?.totalTimeSavedMs ?? 0) / 1000 / 60 / 60) * 10) / 10;
    taxaSucesso = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // KPIs com dados reais — Sprint 6 injeta Horas Poupadas e Taxa de Sucesso
  const KPI = [
    { label:'MRR', value:`$${(totalMrr/1000).toFixed(1)}k`, change:'+12.3%', up:true, spark:[45,52,48,62,58,64,71,68,75,80,84,92].map(v=>v*3.1) },
    { label:'Active Workflows', value:activeWorkspaces.toString(), change:'+8.1%', up:true, spark:[120,132,128,140,148,144,155,162,158,168,175,184] },
    { label:'Horas Poupadas', value:`${horasPoupadas}h`, change: horasPoupadas > 0 ? '+real' : '0%', up: horasPoupadas > 0, spark:[0,2,4,6,8,10,12,15,18,22,26,horasPoupadas] },
    { label:'API Calls (k)', value:totalApiCalls.toFixed(0), change:'+3.2%', up:true, spark:[620,640,660,690,710,730,755,775,795,815,830,847] },
    { label:'Taxa de Sucesso', value:`${taxaSucesso}%`, change: taxaSucesso >= 90 ? '+ótimo' : taxaSucesso >= 70 ? 'bom' : 'atenção', up: taxaSucesso >= 70, spark:[80,82,84,84,85,86,87,88,89,90,91,taxaSucesso] }
  ];

  const MRR_SERIES = [
    { label:'Plans', color:'var(--accent)', data:[120,125,130,138,142,148,155,160,168,172,178,184] },
    { label:'Usage', color:'var(--accent-2)', data:[40,42,45,48,52,55,58,62,66,70,74,78] },
    { label:'Add-ons', color:'var(--positive)', data:[18,19,20,22,23,25,26,28,30,31,33,35] }
  ];

  const WS_SERIES = [
    { label:'Enterprise', color:'var(--accent)', data:[82,85,88,92,95,98,102,105,110,114,118,122] },
    { label:'Pro', color:'var(--accent-2)', data:[240,248,252,260,268,274,282,290,298,308,315,324] },
    { label:'Free', color:'var(--muted)', data:[1020,1050,1040,1080,1100,1120,1150,1160,1180,1200,1210,1220] }
  ];

  const COHORT_LABELS = ['Week 0','Week 1','Week 2','Week 4','Week 6','Week 8','Week 12'];
  const COHORT_DATA = [
    { cohort:'Jan 26', row:[100,72,58,45,38,32,26] },
    { cohort:'Feb 26', row:[100,74,60,48,40,34,28] },
    { cohort:'Mar 26', row:[100,76,62,50,42,36,30] },
    { cohort:'Apr 26', row:[100,75,61,49,41,34,null] },
    { cohort:'May 26', row:[100,77,63,51,null,null,null] }
  ];

  const CUSTOMERS = [
    { name:'Acme Corp', mrr:'$42,500', change:'+5.2%', up:true, status:'active' },
    { name:'Globex Inc', mrr:'$31,200', change:'+2.8%', up:true, status:'active' },
    { name:'Initech', mrr:'$28,750', change:'-1.4%', up:false, status:'at-risk' },
    { name:'Hooli', mrr:'$24,100', change:'+8.9%', up:true, status:'active' },
    { name:'Umbrella Co', mrr:'$19,850', change:'+1.2%', up:true, status:'active' }
  ];

  // 5. Timeline de Execuções (Últimos 30 dias)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30);
  
  let timelineSeries = [
    { label:'Completed', color:'var(--positive)', data: Array(30).fill(0) },
    { label:'Failed', color:'var(--negative)', data: Array(30).fill(0) }
  ];
  let timelineLabels = Array(30).fill('');

  if (organizationId) {
    const rows = await db
      .select({
        day: sql<string>`DATE(${executions.startedAt})`.as('day'),
        completed: sql<number>`SUM(CASE WHEN ${executions.status} = 'completed' THEN 1 ELSE 0 END)`.as('completed'),
        failed: sql<number>`SUM(CASE WHEN ${executions.status} = 'failed' THEN 1 ELSE 0 END)`.as('failed'),
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

    // Map para preencher os dias vazios e formatar
    const daysMap = new Map();
    rows.forEach(r => {
      daysMap.set(r.day, { completed: Number(r.completed), failed: Number(r.failed) });
    });

    const completedData = [];
    const failedData = [];
    const labels = [];
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const stats = daysMap.get(dayStr) || { completed: 0, failed: 0 };
      completedData.push(stats.completed);
      failedData.push(stats.failed);
      labels.push(monthDay);
    }

    timelineSeries = [
      { label:'Completed', color:'var(--positive)', data: completedData },
      { label:'Failed', color:'var(--negative)', data: failedData }
    ];
    timelineLabels = labels;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--fg-2)' }}>O que você quer automatizar hoje?</p>
        <AiPromptBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnalyticsClient 
          kpi={KPI} 
          mrrSeries={MRR_SERIES} 
          timelineSeries={timelineSeries}
          timelineLabels={timelineLabels}
          cohortLabels={COHORT_LABELS} 
          cohortData={COHORT_DATA} 
          customers={CUSTOMERS} 
        />
      </div>
    </div>
  );
}
