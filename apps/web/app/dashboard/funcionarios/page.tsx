import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import db from '@prompthub/database/src/client';
import { agents } from '@prompthub/database/src/schema/agents';
import { agentWorkflows } from '@prompthub/database/src/schema/agent_workflows';
import { executions } from '@prompthub/database/src/schema/executions';
import { users } from '@prompthub/database/src/schema/users';
import { eq, count, and } from 'drizzle-orm';
import { Bot, Briefcase, Zap, Play, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Funcionários de IA - NovaFlow',
};

// Fallback de templates públicos para exibir caso o banco ainda esteja vazio
const TEMPLATE_AGENTS = [
  {
    id: 'sdr-template',
    title: 'SDR de Vendas',
    description: 'Filtra leads recebidos via Webhook, qualifica usando GPT-4o e envia notificação no Slack ou Discord.',
    workflowCount: 3,
    color: 'from-blue-500/20 to-indigo-500/10',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    icon: '🎯',
    isTemplate: true,
  },
  {
    id: 'sac-template',
    title: 'Atendente de SAC',
    description: 'Responde dúvidas comuns no WhatsApp usando Claude 3.5 Sonnet baseado no seu FAQ.',
    workflowCount: 2,
    color: 'from-emerald-500/20 to-green-500/10',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    icon: '🎧',
    isTemplate: true,
  },
  {
    id: 'financeiro-template',
    title: 'Assistente Financeiro',
    description: 'Processa pagamentos aprovados (Stripe), envia email de boas vindas e notifica no Slack.',
    workflowCount: 4,
    color: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/30',
    iconBg: 'bg-amber-500/20',
    icon: '💰',
    isTemplate: true,
  },
  {
    id: 'hr-template',
    title: 'Recrutador (HR)',
    description: 'Filtra currículos recebidos por email e agenda entrevistas para os candidatos qualificados.',
    workflowCount: 2,
    color: 'from-purple-500/20 to-violet-500/10',
    borderColor: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20',
    icon: '👥',
    isTemplate: true,
  },
];

export default async function FuncionariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [dbUser] = await db
    .select({ organizationId: users.organizationId })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  // Buscar agentes reais da organização com contagem de workflows e execuções
  const orgAgents = dbUser?.organizationId
    ? await db
        .select({
          id: agents.id,
          title: agents.title,
          description: agents.description,
        })
        .from(agents)
        .where(eq(agents.organizationId, dbUser.organizationId))
    : [];

  // Para cada agente real, buscar a contagem de workflows associados
  const agentsWithStats = await Promise.all(
    orgAgents.map(async (agent) => {
      const [wfCount] = await db
        .select({ count: count() })
        .from(agentWorkflows)
        .where(eq(agentWorkflows.agentId, agent.id));

      const [runCount] = await db
        .select({ count: count() })
        .from(executions)
        .where(
          and(
            eq(executions.agentId, agent.id),
            eq(executions.status, 'completed'),
          )
        );

      return {
        ...agent,
        workflowCount: Number(wfCount?.count ?? 0),
        completedRuns: Number(runCount?.count ?? 0),
        isTemplate: false,
      };
    })
  );

  // Se não houver agentes reais, exibir os templates para inspirar
  const displayAgents = agentsWithStats.length > 0 ? agentsWithStats : TEMPLATE_AGENTS;
  const hasRealAgents = agentsWithStats.length > 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[var(--accent)]" />
            Funcionários de IA
          </h1>
        </div>
        <p className="text-slate-400">Agentes autônomos que gerenciam múltiplas automações como um único "funcionário".</p>
      </div>

      {/* Banner se for templates */}
      {!hasRealAgents && (
        <div className="mb-6 p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--accent)] font-medium">
            💡 Nenhum funcionário criado ainda. Veja os templates disponíveis para se inspirar e instale um no Marketplace.
          </p>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayAgents.map((agent) => (
          <div
            key={agent.id}
            className={`flex flex-col rounded-2xl border bg-slate-800/80 overflow-hidden transition-all hover:shadow-lg hover:shadow-black/30 ${
              'borderColor' in agent ? agent.borderColor : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            {/* Card Header */}
            <div className={`p-5 bg-gradient-to-br ${'color' in agent ? agent.color : 'from-slate-700/30 to-slate-800/10'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${'iconBg' in agent ? agent.iconBg : 'bg-slate-700/50'}`}>
                  {'icon' in agent ? agent.icon : '🤖'}
                </div>
                {'isTemplate' in agent && agent.isTemplate ? (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-xs border border-slate-600">Template</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs border border-emerald-500/30">Ativo</span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{agent.title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">{agent.description}</p>
            </div>

            {/* Stats */}
            <div className="px-5 py-3 border-t border-slate-700/50 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{agent.workflowCount}</p>
                <p className="text-xs text-slate-500">Workflows</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[var(--accent)]">
                  {'completedRuns' in agent ? agent.completedRuns : '—'}
                </p>
                <p className="text-xs text-slate-500">Execuções</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-slate-700/50">
              {'isTemplate' in agent && agent.isTemplate ? (
                <Link
                  href="/dashboard/marketplace"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[#5b4cdb] text-white text-sm font-medium transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Ver no Marketplace
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/agentes/${agent.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-colors"
                  >
                    <BarChart2 className="w-4 h-4" />
                    Métricas
                  </Link>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--accent)] hover:bg-[#5b4cdb] text-white text-sm font-medium transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Executar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {hasRealAgents && (
        <div className="mt-10 text-center py-10 rounded-2xl border border-dashed border-slate-700 bg-slate-800/30">
          <Bot className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-1">Quer adicionar mais funcionários?</p>
          <p className="text-white font-medium mb-4">Explore o Marketplace e instale pacotes completos em um clique.</p>
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[#5b4cdb] text-white font-medium transition-colors"
          >
            <Zap className="w-4 h-4" />
            Ver Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
