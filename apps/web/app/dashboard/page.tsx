import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard - NovaFlow AI',
  description: 'Gerencie seus workflows e automações',
};

const recentWorkflows = [
  { id: 1, name: 'SDR IA - Qualificação de Leads', status: 'active', executions: 1247, lastRun: '2 min atrás' },
  { id: 2, name: 'Atendimento WhatsApp Automático', status: 'active', executions: 892, lastRun: '5 min atrás' },
  { id: 3, name: 'Gerador de Contratos', status: 'paused', executions: 634, lastRun: '1 hora atrás' },
  { id: 4, name: 'CRM Automático', status: 'active', executions: 521, lastRun: '3 horas atrás' },
];

const aiEmployees = [
  { id: 'sdr', name: 'SDR IA', role: 'Vendas', icon: '👨‍💼', status: 'active', economy: 'R$ 5.800' },
  { id: 'atendente', name: 'Atendente IA', role: 'Suporte', icon: '🎧', status: 'active', economy: 'R$ 12.400' },
  { id: 'marketing', name: 'Marketing IA', role: 'Marketing', icon: '📈', status: 'paused', economy: 'R$ 7.900' },
];

const quickActions = [
  { label: 'Criar Workflow', icon: '➕', href: '/workflows/novo', color: 'bg-primary' },
  { label: 'Contratar Funcionário IA', icon: '🤖', href: '/dashboard/funcionarios', color: 'bg-purple-500' },
  { label: 'Explorar Marketplace', icon: '🔥', href: '/biblioteca', color: 'bg-orange-500' },
  { label: 'Ver Analytics', icon: '📊', href: '/dashboard/analytics', color: 'bg-green-500' },
];

const metrics = [
  { label: 'Execuções este mês', value: '12.847', change: '+23%', positive: true },
  { label: 'Horas economizadas', value: '156h', change: '+18%', positive: true },
  { label: 'Economia estimada', value: 'R$ 26.100', change: '+31%', positive: true },
  { label: 'Workflows ativos', value: '12', change: '+3', positive: true },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral das suas automações</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/workflows/novo" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition">
                + Novo Workflow
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-border bg-white p-6">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold">{metric.value}</p>
              <p className={`mt-2 text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} <span className="text-muted-foreground">vs mês anterior</span>
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Ações Rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white`}>
                  <span className="text-xl">{action.icon}</span>
                </div>
                <h3 className="font-semibold group-hover:text-primary">{action.label}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Workflows */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Workflows Recentes</h2>
                <Link href="/workflows" className="text-sm font-medium text-primary hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-4">
                {recentWorkflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 transition">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${workflow.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <span className={`h-3 w-3 rounded-full ${workflow.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">{workflow.executions.toLocaleString()} execuções • {workflow.lastRun}</p>
                      </div>
                    </div>
                    <Link href={`/workflows/${workflow.id}`} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition">
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Employees */}
          <div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Funcionários de IA</h2>
                <Link href="/dashboard/funcionarios" className="text-sm font-medium text-primary hover:underline">
                  Gerenciar →
                </Link>
              </div>
              <div className="space-y-4">
                {aiEmployees.map((employee) => (
                  <div key={employee.id} className="rounded-xl border border-border p-4 hover:bg-muted/50 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{employee.icon}</span>
                        <div>
                          <h3 className="font-semibold">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {employee.status === 'active' ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Economia mensal</p>
                      <p className="font-bold text-green-600">{employee.economy}</p>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/funcionarios" className="block w-full rounded-xl border border-dashed border-border p-4 text-center text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition">
                  + Contratar novo funcionário
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 rounded-2xl border border-border bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Comece com templates prontos</h2>
              <p className="text-white/80 mb-6">Economize tempo instalando automações pré-configuradas para seu negócio</p>
              <Link href="/biblioteca" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary hover:bg-white/90 transition">
                Explorar Templates
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="hidden lg:block text-6xl">🔥</div>
          </div>
        </div>
      </div>
    </main>
  );
}
