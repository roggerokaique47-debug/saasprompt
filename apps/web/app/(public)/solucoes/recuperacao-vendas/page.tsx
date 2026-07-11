import Link from "next/link";
import "../solucoes.css";

export default function RecuperacaoVendasPage() {
  return (
    <main>
      <section className="rc-hero">
        <div className="container">
          <div>
            <div className="sol-badge fade-up" data-i18n="rc_badge">Para E-commerces e Infoprodutores</div>
            <h1 className="fade-up">Recupere vendas com <span style={{ color: "oklch(64% 0.22 30)" }}>Automação no WhatsApp</span></h1>
            <p className="lead fade-up" data-i18n="rc_desc">
              Não deixe dinheiro na mesa. Recupere carrinhos abandonados, converta PIX não pagos e envie lembretes de boleto via WhatsApp de forma 100% automática.
            </p>
            <div className="hero-cta fade-up">
              <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="rc_cta">Começar a Recuperar Grátis</Link>
            </div>
          </div>
          <div className="recovery-visual fade-up">
            <div className="recovery-visual-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span data-i18n="rc_mockup">Mockup do fluxo de recuperação</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="flow-steps">
            <div className="flow-step fade-up">
              <div className="step-icon">🛒</div>
              <h3 data-i18n="rc_s1_title">Carrinho Abandonado</h3>
              <p data-i18n="rc_s1_desc">Se o cliente preencheu os dados mas não pagou, a IA o chama em 5 minutos perguntando se houve erro no cartão e oferece suporte.</p>
            </div>
            <div className="flow-step fade-up">
              <div className="step-icon">💳</div>
              <h3 data-i18n="rc_s2_title">Boleto e PIX Gerado</h3>
              <p data-i18n="rc_s2_desc">Envie o código copia-e-cola do PIX ou a linha digitável do boleto direto no WhatsApp, reduzindo a inadimplência em até 40%.</p>
            </div>
            <div className="flow-step fade-up">
              <div className="step-icon">🎉</div>
              <h3 data-i18n="rc_s3_title">Boas-vindas (Upsell)</h3>
              <p data-i18n="rc_s3_desc">Assim que o pagamento for aprovado, envie o acesso ao produto e já ofereça um segundo produto complementar com desconto exclusivo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="h2 fade-up" data-i18n="rc_stats_title">Aumente o faturamento sem gastar mais com anúncios</h2>
          <p className="lead fade-up" style={{ margin: "var(--gap-md) auto" }} data-i18n="rc_stats_desc">
            Cerca de 70% dos carrinhos são abandonados no e-commerce brasileiro. Usar WhatsApp em vez de e-mail muda o jogo.
          </p>
          <div className="stat-grid">
            <div className="stat-item fade-up">
              <div className="stat-num">98%</div>
              <div className="stat-label" data-i18n="rc_stat1">Taxa de Abertura</div>
            </div>
            <div className="stat-item fade-up">
              <div className="stat-num">+40%</div>
              <div className="stat-label" data-i18n="rc_stat2">Recuperação PIX</div>
            </div>
            <div className="stat-item fade-up">
              <div className="stat-num">0</div>
              <div className="stat-label" data-i18n="rc_stat3">Bloqueios API*</div>
            </div>
            <div className="stat-item fade-up">
              <div className="stat-num">5 min</div>
              <div className="stat-label" data-i18n="rc_stat4">Setup</div>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "var(--gap-sm)" }}>* Utilizando boas práticas sugeridas no painel.</p>
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="h2 fade-up" data-i18n="rc_cta_title">Pare de perder vendas. Comece a recuperar.</h2>
          <p className="lead fade-up" style={{ margin: "var(--gap-md) auto" }} data-i18n="rc_cta_desc">
            Cada minuto conta. Configure em 5 minutos e veja a diferença no próximo fechamento de mês.
          </p>
          <div className="hero-cta fade-up">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow" data-i18n="rc_cta">
              Começar a Recuperar Grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
