import Link from "next/link";
import "../solucoes.css";

export default function AutomacaoVendasPage() {
  return (
    <main>
      <section className="sl-hero">
        <div className="container">
          <div>
            <div className="sol-badge fade-up" data-i18n="sl_badge">Para Times Comerciais</div>
            <h1 className="fade-up">Automação de Vendas com <span style={{ color: "oklch(60% 0.22 140)" }}>IA</span></h1>
            <p className="lead fade-up" data-i18n="sl_desc">
              Feche mais negócios sem inchar o time. A IA da NovaFlow qualifica leads, agenda reuniões, envia propostas e faz follow-up automaticamente no WhatsApp e e-mail.
            </p>
            <div className="hero-cta fade-up">
              <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="sl_cta">Acelerar Minhas Vendas</Link>
            </div>
          </div>
          <div className="sl-visual fade-up">
            <div className="sl-visual-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <span data-i18n="sl_visual_label">MÉTRICAS DE VENDAS EM TEMPO REAL</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="sl_features_eyebrow">FUNIL AUTOMATIZADO</p>
          <h2 className="h2 fade-up" data-i18n="sl_features_title">Tire o trabalho braçal dos vendedores</h2>
          <div className="use-cases">
            <div className="use-case-card fade-up">
              <div className="uc-icon" style={{ backgroundColor: "oklch(55% 0.18 140 / 0.12)", color: "oklch(60% 0.22 140)" }}>🎯</div>
              <div>
                <h4 data-i18n="sl_u1_title">SDR com IA</h4>
                <p data-i18n="sl_u1_desc">A IA atende o lead em segundos, faz as perguntas de qualificação e, se tiver fit, agenda direto na agenda do closer.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon" style={{ backgroundColor: "oklch(55% 0.18 140 / 0.12)", color: "oklch(60% 0.22 140)" }}>🔁</div>
              <div>
                <h4 data-i18n="sl_u2_title">Follow-up Automático</h4>
                <p data-i18n="sl_u2_desc">Acabou o "estou esperando resposta". A IA manda lembretes personalizados até o lead responder ou dizer não.</p>
              </div>
            </div>
            <div className="use-case-card fade-up">
              <div className="uc-icon" style={{ backgroundColor: "oklch(55% 0.18 140 / 0.12)", color: "oklch(60% 0.22 140)" }}>🧾</div>
              <div>
                <h4 data-i18n="sl_u3_title">Geração de Propostas</h4>
                <p data-i18n="sl_u3_desc">Conectado ao CRM, o fluxo coleta os dados, gera o PDF da proposta comercial e envia direto no WhatsApp do cliente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="sl_why_eyebrow">POR QUE AUTOMATIZAR</p>
          <div className="grid-3">
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", transition: "border-color .3s" }} className="fade-up">
              <div style={{ fontSize: "28px", marginBottom: "var(--gap-sm)" }}>⏱️</div>
              <h3 data-i18n="sl_why1_title">Lead não espera</h3>
              <p style={{ fontSize: "14px", color: "var(--muted)" }} data-i18n="sl_why1_desc">O primeiro contato em até 5 minutos aumenta em 9x a chance de conversão. Sua IA responde na hora, 24/7.</p>
            </div>
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", transition: "border-color .3s" }} className="fade-up">
              <div style={{ fontSize: "28px", marginBottom: "var(--gap-sm)" }}>🎯</div>
              <h3 data-i18n="sl_why2_title">Qualificação inteligente</h3>
              <p style={{ fontSize: "14px", color: "var(--muted)" }} data-i18n="sl_why2_desc">A IA pergunta, pontua e classifica cada lead antes de passar para seu time. Você vende mais, perde menos tempo.</p>
            </div>
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", transition: "border-color .3s" }} className="fade-up">
              <div style={{ fontSize: "28px", marginBottom: "var(--gap-sm)" }}>📊</div>
              <h3 data-i18n="sl_why3_title">Dados que vendem</h3>
              <p style={{ fontSize: "14px", color: "var(--muted)" }} data-i18n="sl_why3_desc">Relatórios automáticos de conversão por etapa, tempo médio de fechamento e fonte de lead. Decisões baseadas em dados reais.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--gap-xl)" }} className="fade-up">
            <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="sl_cta_seo">
              Garantir Acesso Antecipado — 1.000 créditos grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
