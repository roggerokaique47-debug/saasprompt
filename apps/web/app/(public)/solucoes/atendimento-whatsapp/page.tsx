import Link from "next/link";
import "../solucoes.css";

export default function AtendimentoWhatsAppPage() {
  return (
    <main>
      <section className="whatsapp-hero">
        <div className="container">
          <div>
            <div className="sol-badge fade-up" data-i18n="wa_badge">Para Agências e Negócios Locais</div>
            <h1 className="fade-up" data-i18n="wa_title">Atendimento 24/7 com <span style={{ color: "oklch(68% 0.22 170)" }}>IA no WhatsApp</span></h1>
            <p className="lead fade-up" data-i18n="wa_desc">
              Crie um agente de inteligência artificial que responde clientes, agenda reuniões e fecha vendas diretamente no WhatsApp. Tudo arrastando blocos, sem escrever uma linha de código.
            </p>
            <div className="hero-cta fade-up">
              <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow" data-i18n="wa_cta">Criar Agente Grátis</Link>
              <Link href="/preco" className="btn btn-secondary" data-i18n="wa_plans">Ver Planos</Link>
            </div>
          </div>
          <div className="whatsapp-visual fade-up">
            <div className="whatsapp-visual-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
                <path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4"/>
              </svg>
              <span data-i18n="wa_mockup">Mockup do agente no WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow fade-up" style={{ textAlign: "center" }} data-i18n="wa_features_eyebrow">FUNCIONALIDADES</p>
          <h2 className="h2 fade-up" style={{ textAlign: "center", marginBottom: "var(--gap-xl)" }} data-i18n="wa_features_title">Tudo que você precisa para atender no WhatsApp.</h2>
          <div className="grid-3">
            <div className="card fade-up">
              <div className="card-badge">💬</div>
              <h3 data-i18n="wa_f1_title">Conexão via QR Code</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }} data-i18n="wa_f1_desc">Conecte o número da sua empresa escaneando um QR Code no painel. Sem usar API oficial da Meta.</p>
            </div>
            <div className="card fade-up">
              <div className="card-badge">🧩</div>
              <h3 data-i18n="wa_f2_title">Construtor Visual</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }} data-i18n="wa_f2_desc">Editor drag-and-drop para definir quando o robô responde e quando transfere para um humano.</p>
            </div>
            <div className="card fade-up">
              <div className="card-badge">🤖</div>
              <h3 data-i18n="wa_f3_title">Respostas Humanizadas</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }} data-i18n="wa_f3_desc">Integração com ChatGPT. A IA entende áudios, lê o contexto e responde como se fosse você.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up" style={{ textAlign: "center" }} data-i18n="wa_uses_eyebrow">CASOS DE USO</p>
          <h2 className="h2 fade-up" style={{ textAlign: "center", marginBottom: "var(--gap-md)" }} data-i18n="wa_uses_title">Como as empresas estão usando?</h2>
          <div className="use-cases">
            <div className="use-case-card fade-up">
              <div className="uc-icon">📋</div>
              <div>
                <h4 data-i18n="wa_u1_title">Agendamento de Consultas</h4>
                <p data-i18n="wa_u1_desc">Clínicas e consultórios com agendamento automático via Google Calendar.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon">🏠</div>
              <div>
                <h4 data-i18n="wa_u2_title">Qualificação de Leads</h4>
                <p data-i18n="wa_u2_desc">Corretoras imobiliárias com SDR 24 horas por dia qualificando contatos.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon">📡</div>
              <div>
                <h4 data-i18n="wa_u3_title">Suporte Técnico N1</h4>
                <p data-i18n="wa_u3_desc">Provedores de Internet enviando 2ª via de boleto e resolvendo dúvidas frequentes.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon">🍕</div>
              <div>
                <h4 data-i18n="wa_u4_title">Vendas por Delivery</h4>
                <p data-i18n="wa_u4_desc">Cardápio dinâmico com pedidos direto no WhatsApp.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon">👥</div>
              <div>
                <h4 data-i18n="wa_u5_title">Triagem de RH</h4>
                <p data-i18n="wa_u5_desc">Triagem de currículos e dúvidas frequentes no setor de RH.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon">🏪</div>
              <div>
                <h4 data-i18n="wa_u6_title">E-commerce</h4>
                <p data-i18n="wa_u6_desc">Suporte pós-venda, rastreio de pedidos e recomendações personalizadas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="h2 fade-up" data-i18n="wa_cta_title">Pronto para transformar seu atendimento?</h2>
          <p className="lead fade-up" style={{ margin: "var(--gap-md) auto" }} data-i18n="wa_cta_desc">Gratuito para começar. Em 5 minutos seu agente está respondendo clientes.</p>
          <div className="hero-cta fade-up">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow" data-i18n="wa_cta">Criar Agente Grátis</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
