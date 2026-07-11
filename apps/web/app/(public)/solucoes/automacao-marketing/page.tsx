import Link from "next/link";
import "../solucoes.css";

export default function AutomacaoMarketingPage() {
  return (
    <main>
      <section className="mk-hero">
        <div className="container">
          <div>
            <div className="sol-badge fade-up" data-i18n="mk_badge">Para Equipes de Marketing</div>
            <h1 className="fade-up">Automação de Marketing com <span style={{ color: "oklch(64% 0.22 40)" }}>Inteligência Artificial</span></h1>
            <p className="lead fade-up" data-i18n="mk_desc">
              Crie campanhas segmentadas no WhatsApp, nutra leads automaticamente, integre com seu CRM e acompanhe relatórios em tempo real. Tudo sem escrever uma linha de código.
            </p>
            <div className="hero-cta fade-up">
              <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="mk_cta">Quero Automatizar Marketing</Link>
            </div>
          </div>
          <div className="mk-visual fade-up">
            <div className="mk-visual-inner">
              <div className="mk-emoj">📊</div>
              <span data-i18n="mk_visual_label">FLUXO DE CAMPANHA INTELIGENTE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="mk_how_eyebrow">COMO FUNCIONA</p>
          <h2 className="h2 fade-up" data-i18n="mk_how_title">Marketing automatizado em 3 passos</h2>
          <div className="mk-steps" style={{ marginTop: "var(--gap-xl)" }}>
            <div className="mk-step fade-up">
              <div className="step-num">1</div>
              <h3 data-i18n="mk_step1_title">Conecte suas ferramentas</h3>
              <p data-i18n="mk_step1_desc">WhatsApp, e-mail, CRM, planilhas — conecte tudo em minutos com integrações nativas.</p>
            </div>
            <div className="mk-step fade-up">
              <div className="step-num">2</div>
              <h3 data-i18n="mk_step2_title">Crie o funil no editor visual</h3>
              <p data-i18n="mk_step2_desc">Monte fluxos de disparo, nutrição e segmentação arrastando blocos. Sem código.</p>
            </div>
            <div className="mk-step fade-up">
              <div className="step-num">3</div>
              <h3 data-i18n="mk_step3_title">Ative e otimize</h3>
              <p data-i18n="mk_step3_desc">Dispare campanhas automaticamente e acompanhe métricas em tempo real. Ajuste o que for preciso.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="mk_cases_eyebrow">CASOS DE USO</p>
          <h2 className="h2 fade-up" data-i18n="mk_cases_title">O que você pode automatizar</h2>
          <div className="mk-cases">
            <div className="mk-case-card fade-up">
              <div className="mk-icon">📣</div>
              <h3 data-i18n="mk_case1_title">Disparo Segmentado</h3>
              <p data-i18n="mk_case1_desc">Envie campanhas no WhatsApp para listas segmentadas por comportamento, região ou interesse. Taxa de abertura de 98%.</p>
            </div>
            <div className="mk-case-card fade-up">
              <div className="mk-icon">🧲</div>
              <h3 data-i18n="mk_case2_title">Nutrição de Leads</h3>
              <p data-i18n="mk_case2_desc">Sequência automática de mensagens para leads novos: apresentação, valor, prova social, oferta. Cada lead recebe a mensagem certa no momento certo.</p>
            </div>
            <div className="mk-case-card fade-up">
              <div className="mk-icon">📈</div>
              <h3 data-i18n="mk_case3_title">Relatórios Inteligentes</h3>
              <p data-i18n="mk_case3_desc">Relatórios automáticos de abertura, clique e conversão enviados no seu WhatsApp toda semana. Decisões baseadas em dados.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--gap-xl)" }} className="fade-up">
            <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="mk_cta_bottom">
              Quero ser um dos primeiros a testar
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up">SEO RICH</p>
          <h2 className="h2 fade-up" style={{ marginBottom: "var(--gap-md)" }}>Automação de Marketing com Inteligência Artificial</h2>
          <p className="lead fade-up" style={{ maxWidth: "100%" }}>
            Imagine uma máquina de marketing que trabalha 24 horas por dia, 7 dias por semana, sem intervalo, sem férias, sem erros. É isso que a NovaFlow entrega para o seu negócio. Nossa plataforma conecta WhatsApp, CRM, e-mail e bancos de dados em um fluxo inteligente que segmenta, dispara, nutre e mensura campanhas automaticamente.
          </p>
          <p className="lead fade-up" style={{ maxWidth: "100%", marginTop: "var(--gap-md)" }}>
            Diferente de ferramentas tradicionais de automação de marketing, a NovaFlow usa agentes de IA que aprendem o comportamento do seu público e ajustam as campanhas em tempo real. Se um lead não abriu a primeira mensagem, o agente reordena a sequência e tenta um novo abordagem no melhor horário.
          </p>
          <div style={{ textAlign: "center", marginTop: "var(--gap-xl)" }} className="fade-up">
            <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="mk_cta_seo">
              Garantir Acesso Antecipado — 1.000 créditos grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
