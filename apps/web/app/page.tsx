import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { sql } from 'drizzle-orm';
import { WorkflowAICreator } from '@/components/workflow-ai-creator';

export const dynamic = 'force-dynamic';

const integrations = [
  { name: 'Gmail', icon: '📧' },
  { name: 'Google Sheets', icon: '📊' },
  { name: 'Google Drive', icon: '📁' },
  { name: 'WhatsApp', icon: '💬' },
  { name: 'Slack', icon: 'slack' },
  { name: 'Discord', icon: 'discord' },
  { name: 'Stripe', icon: '💳' },
  { name: 'Shopify', icon: '🛍️' },
  { name: 'WooCommerce', icon: '🏪' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'MySQL', icon: '🐬' },
  { name: 'OpenAI', icon: '🤖' },
  { name: 'Claude', icon: '🧠' },
  { name: 'Gemini', icon: '✨' },
  { name: 'GitHub', icon: 'github' },
];

const businessAreas = [
  { id: 'marketing', label: 'Marketing', icon: '📈', description: 'Posts, anúncios, SEO e redes sociais' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒', description: 'Pedidos, estoque e notas fiscais' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'Atendimento, catálogo e CRM' },
  { id: 'ia', label: 'IA', icon: '🤖', description: 'Agentes, prompts e automações inteligentes' },
  { id: 'financeiro', label: 'Financeiro', icon: '💰', description: 'Contas, relatórios e fluxo de caixa' },
  { id: 'rh', label: 'RH', icon: '👥', description: 'Currículos, entrevistas e onboarding' },
  { id: 'empresas', label: 'Pequenas empresas', icon: '🏪', description: 'Automações completas para negócios' },
  { id: 'criar', label: 'Criar do zero', icon: '⚙️', description: 'Editor visual drag-and-drop' },
];

const aiEmployees = [
  { id: 'sdr', name: 'SDR IA', role: 'Vendas', icon: '👨‍💼', description: 'Qualifica leads, envia emails e agenda reuniões automaticamente', tasks: ['Lê leads do formulário', 'Envia email personalizado', 'Responde WhatsApp', 'Agenda reunião no Calendly'], savings: '34 horas/mês', roi: '420%', economy: 'R$ 5.800', color: 'from-blue-500 to-cyan-500' },
  { id: 'atendente', name: 'Atendente IA', role: 'Suporte', icon: '🎧', description: 'Atende clientes 24/7 no WhatsApp, Instagram e site', tasks: ['Responde dúvidas frequentes', 'Envia catálogo de produtos', 'Agenda horários', 'Encaminha para humano'], savings: '80 horas/mês', roi: '550%', economy: 'R$ 12.400', color: 'from-green-500 to-emerald-500' },
  { id: 'financeiro', name: 'Financeiro IA', role: 'Finanças', icon: '💰', description: 'Organiza contas, emite notas e gera relatórios financeiros', tasks: ['Recebe boletos', 'Organiza planilha', 'Envia relatório semanal', 'Controla fluxo de caixa'], savings: '20 horas/mês', roi: '380%', economy: 'R$ 3.200', color: 'from-emerald-500 to-teal-500' },
  { id: 'marketing', name: 'Marketing IA', role: 'Marketing', icon: '📈', description: 'Cria posts, gerencia redes sociais e otimiza anúncios', tasks: ['Cria posts automáticos', 'Gera imagens com IA', 'Agenda publicações', 'Analisa desempenho'], savings: '45 horas/mês', roi: '600%', economy: 'R$ 7.900', color: 'from-purple-500 to-pink-500' },
  { id: 'rh', name: 'RH IA', role: 'Recursos Humanos', icon: '👥', description: 'Triagem de currículos, agendamento de entrevistas e onboarding', tasks: ['Analisa currículos', 'Envia email candidatos', 'Agenda entrevistas', 'Faz onboarding'], savings: '28 horas/mês', roi: '410%', economy: 'R$ 4.600', color: 'from-orange-500 to-red-500' },
  { id: 'ecommerce', name: 'Gestor E-commerce IA', role: 'E-commerce', icon: '🛒', description: 'Atualiza estoque, envia rastreio e recupera carrinhos', tasks: ['Atualiza estoque', 'Envia código rastreio', 'Recupera carrinho', 'Emite nota fiscal'], savings: '52 horas/mês', roi: '720%', economy: 'R$ 9.100', color: 'from-indigo-500 to-blue-500' },
];

const marketplaceAutomations = [
  { id: 'atendimento-whatsapp', name: 'Atendimento WhatsApp', installs: 12400, rating: 4.9, icon: '💬', author: 'NovaFlow Verified', category: 'Atendimento' },
  { id: 'crm-automatico', name: 'CRM Automático', installs: 8920, rating: 4.8, icon: '📊', author: 'NovaFlow Verified', category: 'Vendas' },
  { id: 'sdr-ia', name: 'SDR IA', installs: 7560, rating: 4.9, icon: '👨‍💼', author: 'OpenAI Verified', category: 'Vendas' },
  { id: 'gerador-contrato', name: 'Gerador de Contrato', installs: 6340, rating: 4.7, icon: '📄', author: 'LegalTech Pro', category: 'Jurídico' },
  { id: 'contas-pagar', name: 'Contas a Pagar', installs: 5210, rating: 4.8, icon: '💳', author: 'FinanceHub', category: 'Financeiro' },
  { id: 'instagram-auto', name: 'Instagram Auto-Post', installs: 4890, rating: 4.7, icon: '📱', author: 'SocialMedia AI', category: 'Marketing' },
];

const testimonials = [
  { name: 'Carlos Mendes', role: 'CEO, TechStart', text: 'Economizamos 40 horas por semana com o SDR IA. Simplesmente revolucionário.', rating: 5, avatar: 'CM' },
  { name: 'Ana Paula Silva', role: 'Gerente de Marketing, LojaOnline', text: 'O Marketing IA criou mais de 200 posts no primeiro mês. ROI de 600%!', rating: 5, avatar: 'AS' },
];

export default async function HomePage() {
  const { totalWorkflows } = (await db.select({ totalWorkflows: sql<number>`cast(count(*) as int)`, }).from(workflows))[0] ?? { totalWorkflows: 0 };
  const totalExecutions = Math.max(totalWorkflows * 15, 20000);
  const totalCompanies = Math.max(Math.floor(totalWorkflows / 3), 500);
  const totalIntegrations = integrations.length;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-background pb-20 pt-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="animate-pulse rounded-full bg-green-400 h-2 w-2"></span>
              </span>
              NovaFlow AI - Plataforma de Automação com IA para Empresas
            </div>
            
            <h1 className="mb-8 text-5xl font-bold leading-tight md:text-7xl bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Automatize qualquer processo da sua empresa com IA
            </h1>
            
            <p className="mx-auto mb-12 max-w-3xl text-xl text-slate-300">
              Crie workflows, instale automações prontas ou contrate Funcionários de IA em poucos minutos. Sem programação.
            </p>

            {/* AI Input - Conversational */}
            <div className="mx-auto mb-10 max-w-2xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <input 
                    type="text" 
                    placeholder='Descreva o que quer automatizar... Ex: "Quero responder clientes do WhatsApp automaticamente"'
                    className="flex-1 bg-transparent text-lg text-white placeholder-slate-400 outline-none"
                  />
                  <button className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-white/90 transition">
                    Criar →
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/workflows/novo" className="inline-flex h-14 items-center gap-2 rounded-xl bg-white px-8 text-lg font-semibold text-slate-900 hover:bg-white/90 transition">
                Começar grátis
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <button className="inline-flex h-14 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 text-lg font-semibold text-white hover:bg-white/10 transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Ver demonstração
              </button>
            </div>

            {/* Video Placeholder */}
            <div className="mx-auto mb-16 max-w-4xl">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-2xl">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <button className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-white/20">
                    <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                </div>
                <p className="mt-4 text-center text-sm text-slate-400">▶ Veja um workflow sendo criado em 90 segundos</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: `${totalCompanies}+`, label: 'Empresas usando' },
                { value: `${totalExecutions.toLocaleString()}+`, label: 'Workflows executados' },
                { value: '300+', label: 'Automações prontas' },
                { value: `${totalIntegrations}+`, label: 'Integrações' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-xs text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Integrações com as ferramentas que você já usa
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex flex-col items-center gap-2 grayscale transition hover:grayscale-0">
                <span className="text-3xl">{integration.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Areas Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">O que você deseja automatizar?</h2>
            <p className="mt-3 text-lg text-muted-foreground">Selecione sua área e veja automações específicas para seu negócio</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {businessAreas.map((area) => (
              <Link 
                key={area.id} 
                href={`/workflows?area=${area.id}`}
                className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="mb-4 text-4xl">{area.icon}</div>
                <h3 className="text-lg font-bold group-hover:text-primary">{area.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{area.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Editor Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Editor Visual Drag-and-Drop</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Crie workflows complexos arrastando e conectando nodes. Nossa IA sugere otimizações em tempo real.
              </p>
              <ul className="space-y-4">
                {[
                  'Interface intuitiva estilo Figma',
                  'IA Copilot que sugere melhorias',
                  'Teste em tempo real antes de publicar',
                  'Versionamento automático',
                  'Colaboração em equipe',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-muted-foreground">Workflow Editor</span>
                </div>
                <div className="space-y-4">
                  {/* Workflow visualization */}
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg border border-border bg-slate-50 p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📥</span>
                        <div>
                          <p className="font-semibold text-sm">Webhook</p>
                          <p className="text-xs text-muted-foreground">Novo pedido Shopify</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-px w-8 bg-border"></div>
                    <div className="rounded-lg border border-border bg-slate-50 p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        <div>
                          <p className="font-semibold text-sm">OpenAI</p>
                          <p className="text-xs text-muted-foreground">Gerar resposta</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-px w-8 bg-border"></div>
                    <div className="rounded-lg border border-border bg-slate-50 p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <div>
                          <p className="font-semibold text-sm">Google Sheets</p>
                          <p className="text-xs text-muted-foreground">Salvar dados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="h-8 w-px bg-border"></div>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="rounded-lg border border-border bg-slate-50 p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <div>
                          <p className="font-semibold text-sm">WhatsApp</p>
                          <p className="text-xs text-muted-foreground">Enviar mensagem</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-slate-50 p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📨</span>
                        <div>
                          <p className="font-semibold text-sm">Slack</p>
                          <p className="text-xs text-muted-foreground">Notificar equipe</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Workflow Creator Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4">
          <WorkflowAICreator />
        </div>
      </section>

      {/* AI Employees Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">Funcionalidade Premium</span>
            <h2 className="mt-4 text-4xl font-bold">Funcionários de IA Prontos</h2>
            <p className="mt-3 text-lg text-muted-foreground">Contrate agentes de IA especializados que já vêm configurados com todas as automações necessárias</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiEmployees.map((employee) => (
              <Link key={employee.id} href={`/workflows/novo?template=${employee.id}`} className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-xl hover:shadow-primary/10">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{employee.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <div className={`rounded-full bg-gradient-to-r ${employee.color} px-3 py-1 text-xs font-bold text-white`}>ROI {employee.roi}</div>
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
                    <p className="text-xs text-muted-foreground">Economia mensal</p>
                    <p className="font-bold text-green-600">{employee.economy}</p>
                    <p className="text-xs text-muted-foreground">{employee.savings}</p>
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground group-hover:bg-primary/90 transition">Contratar →</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold">🔥 Marketplace de Automações</h2>
              <p className="mt-3 text-lg text-muted-foreground">Mais de 300 automações prontas para instalar em 1 clique</p>
            </div>
            <Link href="/biblioteca" className="hidden text-sm font-medium text-primary hover:underline sm:block">Ver todo marketplace →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marketplaceAutomations.map((automation) => (
              <Link key={automation.id} href={`/workflows?template=${automation.id}`} className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{automation.icon}</span>
                    <div>
                      <h3 className="font-bold group-hover:text-primary">{automation.name}</h3>
                      <p className="text-xs text-muted-foreground">{automation.category}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium">{automation.rating}</span>
                  </div>
                  <div className="text-muted-foreground">{(automation.installs / 1000).toFixed(1)}k instalações</div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{automation.author}</span>
                </div>
                <button className="w-full rounded-lg bg-primary/10 py-2.5 text-sm font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">Instalar Grátis</button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold md:text-4xl">Calcule Sua Economia</h2>
              <p className="mt-3 text-white/80">Veja quanto tempo e dinheiro você pode economizar com automação</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Número de funcionários</label>
                <input type="number" defaultValue={4} className="w-full rounded-lg border-0 bg-white/10 p-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salário médio (R$)</label>
                <input type="number" defaultValue={3500} className="w-full rounded-lg border-0 bg-white/10 p-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Horas semanais</label>
                <input type="number" defaultValue={40} className="w-full rounded-lg border-0 bg-white/10 p-3 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30" />
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm text-center">
                <p className="text-3xl font-bold">R$ 8.900</p>
                <p className="text-sm text-white/80">Economia mensal estimada</p>
              </div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm text-center">
                <p className="text-3xl font-bold">34h</p>
                <p className="text-sm text-white/80">Horas economizadas</p>
              </div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm text-center">
                <p className="text-3xl font-bold">420%</p>
                <p className="text-sm text-white/80">ROI estimado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">Quem usa, recomenda</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-white p-8">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="mb-6 text-lg text-muted-foreground">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Comece a automatizar hoje mesmo</h2>
          <p className="mb-8 text-lg text-muted-foreground">Junte-se a mais de {totalCompanies}+ empresas que já estão economizando tempo e dinheiro</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cadastro" className="inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:opacity-90 transition">
              Começar Gratuitamente
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/preco" className="inline-flex h-14 items-center gap-2 rounded-xl border border-border bg-white px-8 text-lg font-semibold hover:bg-muted transition">
              Ver Planos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
