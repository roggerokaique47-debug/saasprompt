import Link from 'next/link';
import { Hero } from '@/components/landing/hero';
import { VslSection } from '@/components/landing/vsl-section';
import { VipForm } from '@/components/landing/vip-form';
import { RoiCalculator } from '@/components/landing/roi-calculator';


export default function HomePage() {
  return (
    <main id="content">
      <Hero />
      <VslSection />

      {/* FEATURES */}
      <section className="section section-alt" id="funcionalidades">
        <div className="container stack" style={{ gap: 56 }}>
          <div className="animate-fade-in-up" style={{ maxWidth: '40ch' }}>
            <p className="eyebrow">A PLATAFORMA DEFINITIVA</p>
            <h2 className="h2">Uma equipe inteira de IA à sua disposição 24/7.</h2>
          </div>
          <div className="grid-3">
            <div className="card animate-fade-in-up feature">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[#25D366] bg-opacity-10 mb-5">
                <img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp" width={24} height={24} />
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">Agentes de WhatsApp</h3>
              <p className="text-[15px] text-[var(--muted)] m-0">Atenda clientes, qualifique leads e recupere carrinhos abandonados de forma 100% autônoma.</p>
            </div>
            <div className="card animate-fade-in-up feature">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[#FF7A59] bg-opacity-10 mb-5">
                <img src="https://cdn.simpleicons.org/hubspot/FF7A59" alt="HubSpot" width={24} height={24} />
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">Integração com CRMs</h3>
              <p className="text-[15px] text-[var(--muted)] m-0">Conecte nativamente HubSpot, Salesforce e mais. Dados de vendas atualizados em tempo real pelos seus agentes.</p>
            </div>
            <div className="card animate-fade-in-up feature">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent)] mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <path d="M6.5 10v4.5A2.5 2.5 0 0 0 9 17h5" />
                </svg>
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">Construtor visual de fluxos</h3>
              <p className="text-[15px] text-[var(--muted)] m-0">Monte automações complexas arrastando blocos. Dispare ações por data, mensagem, webhook ou agendamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="como-funciona">
        <div className="container stack" style={{ gap: 56 }}>
          <div className="animate-fade-in-up mx-auto max-w-[48ch] text-center">
            <p className="eyebrow">COMO FUNCIONA</p>
            <h2 className="h2">Em 4 passos sua automação está no ar.</h2>
            <p className="lead mx-auto mt-4">Sem complicação. Sem reunião técnica. A NovaFlow foi feita para quem quer resultados rápidos.</p>
          </div>
          <div className="step-grid">
            <div className="step-card card animate-fade-in-up">
              <h3 className="mb-1.5 text-lg">Escolha um template</h3>
              <p className="mx-auto max-w-[28ch] text-[14px] text-[var(--muted)] m-0">Navegue pela biblioteca com dezenas de fluxos prontos: atendimento, vendas, marketing, suporte. Ou comece do zero.</p>
            </div>
            <div className="step-card card animate-fade-in-up">
              <h3 className="mb-1.5 text-lg">Conecte suas ferramentas</h3>
              <p className="mx-auto max-w-[28ch] text-[14px] text-[var(--muted)] m-0">Vincule WhatsApp, Google Sheets, CRM, e-mail e banco de dados em poucos cliques. A NovaFlow gerencia a autenticação.</p>
            </div>
            <div className="step-card card animate-fade-in-up">
              <h3 className="mb-1.5 text-lg">Personalize o fluxo</h3>
              <p className="mx-auto max-w-[28ch] text-[14px] text-[var(--muted)] m-0">Arraste blocos, ajuste mensagens, defina regras. O construtor visual mostra exatamente o que cada agente vai fazer.</p>
            </div>
            <div className="step-card card animate-fade-in-up">
              <h3 className="mb-1.5 text-lg">Ative e acompanhe</h3>
              <p className="mx-auto max-w-[28ch] text-[14px] text-[var(--muted)] m-0">Publique seu fluxo em segundos. O painel ao vivo mostra execuções, economia de tempo e retorno sobre cada automação.</p>
            </div>
          </div>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <Link href="/cadastro" className="btn btn-primary btn-arrow">Criar Conta Grátis</Link>
            <Link href="/preco" className="btn btn-secondary">Ver Planos</Link>
          </div>
        </div>
      </section>

      {/* RESULTS / STATS */}
      <section className="section section-alt" id="resultados">
        <div className="container stack" style={{ gap: 40 }}>
          <div className="animate-fade-in-up mx-auto max-w-[40ch] text-center">
            <p className="eyebrow">RESULTADOS</p>
            <h2 className="h2">Números que falam por si.</h2>
          </div>
          <div className="grid-3">
            <div className="stat-card card animate-fade-in-up">
              <div className="stat-num num">12<span className="stat-unit">×</span></div>
              <p className="stat-label">mais leads qualificados com os agentes de IA vs. formulários tradicionais.</p>
            </div>
            <div className="stat-card card animate-fade-in-up">
              <div className="stat-num num">3.200+</div>
              <p className="stat-label">equipes que já automatizam vendas, suporte e operações com a plataforma.</p>
            </div>
            <div className="stat-card card animate-fade-in-up">
              <div className="stat-num num">40<span className="stat-unit">h/mês</span></div>
              <p className="stat-label">em média de horas recuperadas por equipe — tempo que volta para o que importa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="section">
        <div className="container quote-block">
          <div className="quote-mark">"</div>
          <blockquote className="quote-text animate-fade-in-up">
            Em dois dias tínhamos um agente no WhatsApp respondendo 80% das perguntas dos clientes. A NovaFlow transformou nosso suporte sem precisar de um time de TI.
          </blockquote>
          <p className="quote-author"><span>Marina Lemos</span>, Head de Operações na BuildBox</p>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="section section-alt" id="calculadora">
        <div className="container">
          <RoiCalculator />
        </div>
      </section>

      {/* INTEGRAÇÕES REAIS */}
      <section className="section" id="integracoes">
        <div className="container stack" style={{ gap: 48 }}>
          <div className="animate-fade-in-up mx-auto max-w-[40ch] text-center">
            <p className="eyebrow">INTEGRAÇÕES</p>
            <h2 className="h2">Conecta com as ferramentas que você já usa.</h2>
            <p className="lead mx-auto mt-4">Mais de 50 integrações nativas. Nenhuma linha de código necessária.</p>
          </div>
          <div className="grid-3" style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {[
              { name: 'WhatsApp', icon: 'https://cdn.simpleicons.org/whatsapp/25D366', color: '#25D366' },
              { name: 'OpenAI', icon: 'https://cdn.simpleicons.org/openai/ffffff', color: '#10A37F' },
              { name: 'Google Sheets', icon: 'https://cdn.simpleicons.org/googlesheets/34A853', color: '#34A853' },
              { name: 'Gmail', icon: 'https://cdn.simpleicons.org/gmail/EA4335', color: '#EA4335' },
              { name: 'Stripe', icon: 'https://cdn.simpleicons.org/stripe/635BFF', color: '#635BFF' },
              { name: 'Shopify', icon: 'https://cdn.simpleicons.org/shopify/96BF48', color: '#96BF48' },
              { name: 'Slack', icon: 'https://cdn.simpleicons.org/slack/E01E5A', color: '#E01E5A' },
              { name: 'HubSpot', icon: 'https://cdn.simpleicons.org/hubspot/FF7A59', color: '#FF7A59' },
              { name: 'Discord', icon: 'https://cdn.simpleicons.org/discord/5865F2', color: '#5865F2' },
              { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/ffffff', color: '#ffffff' },
              { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1', color: '#4169E1' },
              { name: 'Gemini', icon: 'https://cdn.simpleicons.org/googlegemini/4285F4', color: '#4285F4' },
            ].map((integration) => (
              <div key={integration.name} className="card animate-fade-in-up" style={{ padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${integration.color}18`, border: `1px solid ${integration.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={integration.icon} alt={integration.name} width={22} height={22} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP FORM */}
      <section className="section section-alt cta-strip" id="vip-form">
        <div className="container">
          <div className="animate-fade-in-up vip-form-wrap">
            <p className="eyebrow">ACESSO ANTECIPADO</p>
            <h2 className="h2">Entre para a Lista VIP</h2>
            <p className="lead mx-auto mt-3 max-w-[48ch]">Seja um dos primeiros a usar a NovaFlow. Os 100 primeiros cadastros ganham <strong className="text-[var(--accent)]">1.000 créditos gratuitos</strong> vitalícios.</p>
            <VipForm />
          </div>
        </div>
      </section>
    </main>
  );
}
