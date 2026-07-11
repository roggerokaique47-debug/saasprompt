import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { executions } from '@prompthub/database/src/schema/executions';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { ExecutionStepsPanel } from '@/components/execution-steps-panel';

const STATUS_COLOR: Record<string, string> = {
  pending:   'text-gray-400 bg-gray-800/60',
  running:   'text-yellow-400 bg-yellow-900/40 animate-pulse',
  completed: 'text-green-400 bg-green-900/40',
  failed:    'text-red-400 bg-red-900/40',
  cancelled: 'text-gray-500 bg-gray-800/40',
};

const STATUS_LABEL: Record<string, string> = {
  pending:   'Aguardando',
  running:   'Executando',
  completed: 'Concluído',
  failed:    'Falhou',
  cancelled: 'Cancelado',
};

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  // Zero Trust: buscar execução com filtro por userId
  const [execution] = await db
    .select({
      id: executions.id,
      status: executions.status,
      trigger: executions.trigger,
      totalSteps: executions.totalSteps,
      completedSteps: executions.completedSteps,
      durationMs: executions.durationMs,
      startedAt: executions.startedAt,
      completedAt: executions.completedAt,
      workflowId: executions.workflowId,
    })
    .from(executions)
    .where(and(eq(executions.id, id), eq(executions.userId, user.id)))
    .limit(1);

  if (!execution) return notFound();

  // Buscar nome do workflow
  const [workflow] = await db
    .select({ title: workflows.title })
    .from(workflows)
    .where(eq(workflows.id, execution.workflowId))
    .limit(1);

  const progress = execution.totalSteps && execution.totalSteps > 0
    ? Math.round(((execution.completedSteps ?? 0) / execution.totalSteps) * 100)
    : 0;

  const statusCls = STATUS_COLOR[execution.status] ?? STATUS_COLOR.pending;

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] text-white min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/dashboard/execucoes" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← Execuções
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-gray-300 text-sm font-mono">{id.slice(0, 8)}...</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-xl font-bold text-white">
              {workflow?.title ?? 'Workflow'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Trigger: <span className="text-gray-300">{execution.trigger}</span>
              {execution.startedAt && (
                <> · Iniciado em <span className="text-gray-300">
                  {new Date(execution.startedAt).toLocaleString('pt-BR')}
                </span></>
              )}
              {execution.durationMs && (
                <> · Duração <span className="text-gray-300">
                  {execution.durationMs < 1000
                    ? `${execution.durationMs}ms`
                    : `${(execution.durationMs / 1000).toFixed(1)}s`}
                </span></>
              )}
            </p>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusCls}`}>
            {STATUS_LABEL[execution.status] ?? execution.status}
          </span>
        </div>

        {/* Progress bar */}
        {execution.status === 'running' && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{execution.completedSteps ?? 0} / {execution.totalSteps ?? '?'} nós</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Steps Panel */}
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Nós Executados
        </h2>
        <ExecutionStepsPanel executionId={id} />
      </div>
    </div>
  );
}
