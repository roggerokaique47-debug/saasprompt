import type { Metadata } from 'next';
import Link from 'next/link';
import { FeedbackWidget } from '@/components/feedback-widget';

export const metadata: Metadata = {
  title: 'Dashboard - NovaFlow AI',
  description: 'Gerencie seus workflows e automacoes',
};
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { Medal, Trophy, Star } from 'lucide-react';

// (mantém os arrays estáticos por enquanto)
const recentWorkflows = [
  { id: 1, name: 'SDR IA - Qualificacao de Leads', status: 'active', executions: 1247, lastRun: '2 min atras' },
  { id: 2, name: 'Atendimento WhatsApp Automatico', status: 'active', executions: 892, lastRun: '5 min atras' },
  { id: 3, name: 'Gerador de Contratos', status: 'paused', executions: 634, lastRun: '1 hora atras' },
  { id: 4, name: 'CRM Automatico', status: 'active', executions: 521, lastRun: '3 horas atras' },
];

const aiEmployees = [
  { id: 'sdr', name: 'SDR IA', role: 'Vendas', icon: '\u{1F468}\u200D\u{1F4BC}', status: 'active', economy: 'R$ 5.800' },
  { id: 'atendente', name: 'Atendente IA', role: 'Suporte', icon: '\u{1F3A7}', status: 'active', economy: 'R$ 12.400' },
  { id: 'marketing', name: 'Marketing IA', role: 'Marketing', icon: '\u{1F4C8}', status: 'paused', economy: 'R$ 7.900' },
];

const quickActions = [
  { label: 'Criar Workflow', icon: '\u2795', href: '/workflows/novo', color: 'bg-primary' },
  { label: 'Contratar Funcionario IA', icon: '\u{1F916}', href: '/dashboard/funcionarios', color: 'bg-purple-500' },
  { label: 'Explorar Marketplace', icon: '\u{1F525}', href: '/biblioteca', color: 'bg-orange-500' },
  { label: 'Ver Analytics', icon: '\u{1F4CA}', href: '/dashboard/analytics', color: 'bg-green-500' },
];

const metrics = [
  { label: 'Execucoes este mes', value: '12.847', change: '+23%', positive: true },
  { label: 'Horas economizadas', value: '156h', change: '+18%', positive: true },
  { label: 'Economia estimada', value: 'R$ 26.100', change: '+31%', positive: true },
  { label: 'Workflows ativos', value: '12', change: '+3', positive: true },
];

import { createClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
  // Autenticação Real B2B via Supabase
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let points = 0;
  if (authUser) {
    const userResult = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);
    const user = userResult[0];
    points = user?.points || 0;
  }

  const getBadges = (pts: number) => {
    const badges = [];
    if (pts >= 0) badges.push({ name: 'Iniciante', icon: <Star className="h-5 w-5 text-slate-400" />, color: 'bg-slate-100 text-slate-600' });
    if (pts >= 10) badges.push({ name: 'Criador Estrela', icon: <Medal className="h-5 w-5 text-amber-500" />, color: 'bg-amber-50 text-amber-700 border-amber-200' });
    if (pts >= 50) badges.push({ name: 'Mestre da Automação', icon: <Trophy className="h-5 w-5 text-purple-500" />, color: 'bg-purple-50 text-purple-700 border-purple-200' });
    return badges;
  };
  
  const userBadges = getBadges(points);

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-muted-foreground">Visão geral das suas automações</p>
                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {points} pontos
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/workflows/novo" className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90">
                + Novo Workflow
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-border bg-white p-6">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold">{metric.value}</p>
              <p className={`mt-2 text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} <span className="text-muted-foreground">vs mes anterior</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Minhas Conquistas</h2>
          <div className="flex flex-wrap gap-4">
            {userBadges.map((badge) => (
              <div key={badge.name} className={`flex items-center gap-3 rounded-xl border p-4 ${badge.color}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-bold">{badge.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">Acoes Rapidas</h2>
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
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Workflows Recentes</h2>
                <Link href="/workflows/meus" className="text-sm font-medium text-primary hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-4">
                {recentWorkflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between rounded-xl border border-border p-4 transition hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${workflow.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <span className={`h-3 w-3 rounded-full ${workflow.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">{workflow.executions.toLocaleString()} execucoes • {workflow.lastRun}</p>
                      </div>
                    </div>
                    <Link href={`/workflows/${workflow.id}`} className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Funcionarios de IA</h2>
                <Link href="/dashboard/funcionarios" className="text-sm font-medium text-primary hover:underline">
                  Gerenciar →
                </Link>
              </div>
              <div className="space-y-4">
                {aiEmployees.map((employee) => (
                  <div key={employee.id} className="rounded-xl border border-border p-4 transition hover:bg-muted/50">
                    <div className="mb-3 flex items-center justify-between">
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
                <Link href="/dashboard/funcionarios" className="block w-full rounded-xl border border-dashed border-border p-4 text-center text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary">
                  + Contratar novo funcionario
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Comece com templates prontos</h2>
              <p className="mb-6 text-white/80">Economize tempo instalando automacoes pre-configuradas para seu negocio</p>
              <Link href="/biblioteca" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary transition hover:bg-white/90">
                Explorar Templates
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="hidden text-6xl lg:block">{'\u{1F525}'}</div>
          </div>
        </div>
      </div>
      
      <FeedbackWidget />
    </main>
  );
}
