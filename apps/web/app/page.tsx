import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const aiEmployees = [
  { id: 'sdr', name: 'SDR IA', role: 'Vendas', icon: '👨‍💼', description: 'Qualifica leads, envia emails e agenda reuniões automaticamente', tasks: ['Lê leads do formulário', 'Envia email personalizado', 'Responde WhatsApp', 'Agenda reunião no Calendly'], savings: '34 horas/mês', roi: '420%', color: 'from-blue-500 to-cyan-500' },
  { id: 'atendente', name: 'Atendente IA', role: 'Suporte', icon: '🎧', description: 'Atende clientes 24/7 no WhatsApp, Instagram e site', tasks: ['Responde dúvidas frequentes', 'Envia catálogo de produtos', 'Agenda horários', 'Encaminha para humano'], savings: '80 horas/mês', roi: '550%', color: 'from-green-500 to-emerald-500' },
  { id: 'financeiro', name: 'Financeiro IA', role: 'Finanças', icon: '💰', description: 'Organiza contas, emite notas e gera relatórios financeiros', tasks: ['Recebe boletos', 'Organiza planilha', 'Envia relatório semanal', 'Controla fluxo de caixa'], savings: '20 horas/mês', roi: '380%', color: 'from-emerald-500 to-teal-500' },
  { id: 'marketing', name: 'Marketing IA', role: 'Marketing', icon: '📈', description: 'Cria posts, gerencia redes sociais e otimiza anúncios', tasks: ['Cria posts automáticos', 'Gera imagens com IA', 'Agenda publicações', 'Analisa desempenho'], savings: '45 horas/mês', roi: '600%', color: 'from-purple-500 to-pink-500' },
  { id: 'rh', name: 'RH IA', role: 'Recursos Humanos', icon: '👥', description: 'Triagem de currículos, agendamento de entrevistas e onboarding', tasks: ['Analisa currículos', 'Envia email candidatos', 'Agenda entrevistas', 'Faz onboarding'], savings: '28 horas/mês', roi: '410%', color: 'from-orange-500 to-red-500' },
  { id: 'ecommerce', name: 'Gestor E-commerce IA', role: 'E-commerce', icon: '🛒', description: 'Atualiza estoque, envia rastreio e recupera carrinhos', tasks: ['Atualiza estoque', 'Envia código rastreio', 'Recupera carrinho', 'Emite nota fiscal'], savings: '52 horas/mês', roi: '720%', color: 'from-indigo-500 to-blue-500' },
];

const objectives = [
  { id: 'vender-mais', label: 'Vender mais', icon: '📈', color: 'bg-green-100 text-green-700' },
  { id: 'economizar-tempo', label: 'Economizar tempo', icon: '⏰', color: 'bg-blue-100 text-blue-700' },
  { id: 'criar-agente-ia', label: 'Criar um agente de IA', icon: '🤖', color: 'bg-purple-100 text-purple-700' },
  { id: 'automatizar-whatsapp', label: 'Automatizar WhatsApp', icon: '💬', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'automatizar-ecommerce', label: 'Automatizar e-commerce', icon: '📦', color: 'bg-orange-100 text-orange-700' },
  { id: 'automatizar-financeiro', label: 'Automatizar financeiro', icon: '💰', color: 'bg-red-100 text-red-700' },
  { id: 'automatizar-rh', label: 'Automatizar RH', icon: '👥', color: 'bg-pink-100 text-pink-700' },
  { id: 'automatizar-emails', label: 'Automatizar e-mails', icon: '📧', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'redes-sociais', label: 'Redes sociais', icon: '📱', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'criar-do-zero', label: 'Criar do zero', icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
];

const readyAutomations = [
  { id: 'atendimento-whatsapp', name: 'Atendimento WhatsApp', installs: 1247, rating: 4.9, icon: '💬' },
  { id: 'crm-automatico', name: 'CRM Automático', installs: 892, rating: 4.8, icon: '📊' },
  { id: 'sdr-ia', name: 'SDR IA', installs: 756, rating: 4.9, icon: '👨‍💼' },
  { id: 'gerador-contrato', name: 'Gerador de Contrato', installs: 634, rating: 4.7, icon: '📄' },
  { id: 'contas-pagar', name: 'Contas a Pagar', installs: 521, rating: 4.8, icon: '💳' },
];

export default async function HomePage() {
  const { totalWorkflows } = (await db.select({ totalWorkflows: sql<number>\`cast(count(*) as int)\`, }).from(workflows))[0] ?? { totalWorkflows: 0 };

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-20 pt-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
              🚀 Automatize seu trabalho com agentes de IA prontos em minutos — sem programar
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Contrate{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Funcionários de IA
              </span>{' '}
              para Seu Negócio
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Em vez de criar workflows complexos, escolha um funcionário de IA pronto.
              Ele já vem com todas as automações, integrações e inteligência artificial necessárias.
            </p>
            <div className="mx-auto mb-8 max-w-3xl">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Qual é sua área?
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {['🏪 Pequena empresa', '🛒 E-commerce', '💬 WhatsApp', '📈 Marketing', '🤖 IA'].map((item) => (
                  <Link key={item} href={\`/workflows?area=\${encodeURIComponent(item)}\`} className="rounded-xl border border-border bg-white p-3 text-sm font-medium transition hover:border-primary hover:shadow-md">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/workflows/novo" className="inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:opacity-90">
                Contratar Primeiro Funcionário
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link href="/biblioteca" className="inline-flex h-14 items-center gap-2 rounded-xl border border-border bg-white px-8 text-lg font-semibold hover:bg-muted">
                Ver Marketplace
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span>⚡ Instalação em 1 clique</span>
              <span>🎯 Já configurado e pronto</span>
              <span>💰 Economia média de R$ 9.300/mês</span>
              <span>⭐ {totalWorkflows}+ automações disponíveis</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Escolha Seu Funcionário de IA</h2>
            <p className="mt-2 text-muted-foreground">Cada um já vem com todas as automações necessárias para executar suas tarefas</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiEmployees.map((employee) => (
              <Link key={employee.id} href={\`/workflows/novo?template=\${employee.id}\`} className="group rounded-xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{employee.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <div className={\`rounded-full bg-gradient-to-r \${employee.color} px-3 py-1 text-xs font-bold text-white\`}>ROI {employee.roi}</div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{employee.description}</p>
                <div className="mb-4 space-y-2">
                  {employee.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-muted-foreground">{task}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Economia</p>
                    <p className="font-bold text-green-600">{employee.savings}</p>
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground group-hover:bg-primary/90">Contratar →</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">O Que Você Quer Fazer Hoje?</h2>
            <p className="mt-2 text-muted-foreground">Selecione seu objetivo e nós mostramos as melhores automações</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {objectives.map((obj) => (
              <Link key={obj.id} href={\`/workflows?objective=\${obj.id}\`} className={\`\${obj.color} flex flex-col items-center justify-center rounded-xl p-6 text-center transition hover:scale-105 hover:shadow-md\`}>
                <span className="mb-2 text-3xl">{obj.icon}</span>
                <span className="text-sm font-medium">{obj.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">🔥 Automações Mais Populares</h2>
              <p className="mt-2 text-muted-foreground">Instale em 1 clique e comece a usar imediatamente</p>
            </div>
            <Link href="/biblioteca" className="hidden text-sm font-medium text-primary hover:underline sm:block">Ver todo marketplace →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {readyAutomations.map((automation) => (
              <Link key={automation.id} href={\`/workflows?template=\${automation.id}\`} className="group rounded-xl border border-border bg-white p-5 transition hover:border-primary hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{automation.icon}</span>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">{automation.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>⭐ {automation.rating}</span>
                      <span>•</span>
                      <span>{automation.installs} instalações</span>
                    </div>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground">Instalar Grátis</button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-10 text-center text-white md:p-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Resultados Reais de Quem Já Usa</h2>
            <p className="mx-auto mb-10 max-w-2xl text-white/80">Nossos usuários economizam tempo e dinheiro com automações inteligentes</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur"><p className="text-4xl font-bold">34h</p><p className="mt-1 text-sm text-white/80">Economizadas por mês</p></div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur"><p className="text-4xl font-bold">R$ 9.300</p><p className="mt-1 text-sm text-white/80">Economia média mensal</p></div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur"><p className="text-4xl font-bold">420%</p><p className="mt-1 text-sm text-white/80">ROI médio</p></div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur"><p className="text-4xl font-bold">2.400+</p><p className="mt-1 text-sm text-white/80">Tarefas automatizadas</p></div>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/cadastro" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-primary hover:opacity-90">Começar Gratuitamente</Link>
              <Link href="/preco" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10">Ver Planos</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Comece em 3 Passos Simples</h2>
            <p className="mt-2 text-muted-foreground">Sem complexidade. Sem programação. Sem perda de tempo.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">🎯</div>
              <h3 className="text-xl font-bold">1. Escolha seu objetivo</h3>
              <p className="mt-2 text-muted-foreground">Digite o que você quer automatizar ou escolha um funcionário de IA pronto</p>
            </div>
            <div className="rounded-xl bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">⚡</div>
              <h3 className="text-xl font-bold">2. Instale em 1 clique</h3>
              <p className="mt-2 text-muted-foreground">Nossa IA configura tudo automaticamente com suas integrações</p>
            </div>
            <div className="rounded-xl bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">🚀</div>
              <h3 className="text-xl font-bold">3. Veja a mágica acontecer</h3>
              <p className="mt-2 text-muted-foreground">Acompanhe execuções, economia de tempo e ROI em tempo real</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
