import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, desc } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, CheckCircle2, XCircle, Clock, Loader2, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const STATUS_CONFIG = {
  pending:   { label: 'Na Fila',   icon: Clock,         color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
  running:   { label: 'Executando', icon: Loader2,       color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  completed: { label: 'Concluído', icon: CheckCircle2,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  failed:    { label: 'Falhou',    icon: XCircle,        color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'running' ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
}

export default async function ExecucoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Buscar execuções do usuário com join no workflow (multi-tenant)
  const rawExecutions = await db
    .select({
      id: executions.id,
      workflowId: executions.workflowId,
      status: executions.status,
      trigger: executions.trigger,
      durationMs: executions.durationMs,
      error: executions.error,
      startedAt: executions.startedAt,
      completedAt: executions.completedAt,
      workflowTitle: workflows.title,
    })
    .from(executions)
    .leftJoin(workflows, eq(executions.workflowId, workflows.id))
    .where(eq(executions.userId, user.id))
    .orderBy(desc(executions.startedAt))
    .limit(50);

  // Métricas rápidas
  const total = rawExecutions.length;
  const completed = rawExecutions.filter((e) => e.status === 'completed').length;
  const failed = rawExecutions.filter((e) => e.status === 'failed').length;
  const running = rawExecutions.filter((e) => e.status === 'running' || e.status === 'pending').length;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Execuções</h1>
          <p className="text-slate-400">Histórico e status em tempo real de todas as automações.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Fila Ativa
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Concluídas</p>
          <p className="text-2xl font-bold text-emerald-400">{completed}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Falharam</p>
          <p className="text-2xl font-bold text-red-400">{failed}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Taxa de Sucesso</p>
          <p className={`text-2xl font-bold ${successRate >= 90 ? 'text-emerald-400' : successRate >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
            {successRate}%
          </p>
        </div>
      </div>

      {/* Como funciona a fila */}
      <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-start gap-3">
        <Zap className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-white">Execução assíncrona via Inngest</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Os workflows rodam em background via fila de jobs. O servidor responde instantaneamente e você acompanha o progresso aqui.
            Jobs com falha são reexecutados automaticamente até 3x.
          </p>
        </div>
      </div>

      {/* Lista de Execuções */}
      {rawExecutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30">
          <Activity className="w-10 h-10 text-slate-600 mb-3" />
          <h2 className="text-lg font-medium text-white mb-1">Nenhuma execução ainda</h2>
          <p className="text-slate-400 text-sm mb-4">Vá nos seus workflows e clique em "Executar" para ver o log aqui.</p>
          <Link href="/dashboard/workflows" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[#5b4cdb] transition-colors">
            Ver Workflows
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_100px_110px_80px] gap-4 px-5 py-3 bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700">
            <span>Workflow</span>
            <span>Status</span>
            <span>Gatilho</span>
            <span>Duração</span>
            <span>Quando</span>
          </div>

          <div className="divide-y divide-slate-800">
            {rawExecutions.map((exec) => (
              <Link
                key={exec.id}
                href={`/dashboard/execucoes/${exec.id}`}
                className="grid grid-cols-[1fr_120px_100px_110px_80px] gap-4 px-5 py-3.5 items-center hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <span className="font-medium text-white text-sm truncate block">
                    {exec.workflowTitle || 'Workflow Deletado'}
                  </span>
                  {exec.error && (
                    <p className="text-xs text-red-400 mt-0.5 truncate flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {exec.error}
                    </p>
                  )}
                </div>

                <div><StatusBadge status={exec.status} /></div>

                <div>
                  <span className="text-xs text-slate-400 capitalize">{exec.trigger}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-mono">
                    {exec.durationMs ? `${(exec.durationMs / 1000).toFixed(2)}s` : '—'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500" title={exec.startedAt?.toISOString()}>
                    {exec.startedAt
                      ? formatDistanceToNow(new Date(exec.startedAt), { addSuffix: true, locale: ptBR })
                      : '—'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
