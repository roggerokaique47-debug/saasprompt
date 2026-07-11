import Link from "next/link";
import "../solucoes.css";

export default function AutomacaoSuportePage() {
  return (
    <main>
      <section className="sp-hero">
        <div className="container">
          <div>
            <div className="sol-badge fade-up" data-i18n="sp_badge">Para Times de CS e Suporte</div>
            <h1 className="fade-up">Automação de Suporte com <span style={{ color: "oklch(60% 0.22 260)" }}>IA</span></h1>
            <p className="lead fade-up" data-i18n="sp_desc">
              Reduza o tempo de espera para zero. Crie agentes de suporte que leem sua documentação, resolvem chamados repetitivos e transbordam para atendentes apenas quando necessário.
            </p>
            <div className="hero-cta fade-up">
              <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="sp_cta">Automatizar meu suporte</Link>
            </div>
          </div>
          <div className="sp-visual fade-up">
            <div className="sp-visual-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span data-i18n="sp_visual_label">TICKET RESOLVIDO INSTANTANEAMENTE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="sp_benefits_eyebrow">BENEFÍCIOS</p>
          <h2 className="h2 fade-up" data-i18n="sp_benefits_title">Como a IA melhora seu suporte</h2>
          <div className="grid-3">
            <div className="card fade-up">
              <div className="card-badge">⚡</div>
              <h3 data-i18n="sp_ben1_title">Resolução Imediata</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }} data-i18n="sp_ben1_desc">A IA responde dúvidas comuns em segundos, reduzindo o TMA e melhorando o CSAT.</p>
            </div>
            <div className="card fade-up">
              <div className="card-badge">📚</div>
              <h3 data-i18n="sp_ben2_title">Aprende com sua Base</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }} data-i18n="sp_ben2_desc">Basta enviar o link da sua FAQ, Notion ou manuais. A IA consome o conteúdo e responde com base neles.</p>
            </div>
            <div className="card fade-up">
              <div className="card-badge">🔄</div>
              <h3 data-i18n="sp_ben3_title">Transbordo Inteligente</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }} data-i18n="sp_ben3_desc">O robô tenta resolver. Se a dúvida for complexa ou o cliente quiser um humano, o chat é transferido com o histórico.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--gap-xl)" }} className="fade-up">
            <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="sp_cta_bottom">
              Quero ser um dos primeiros a testar
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="sp_flow_eyebrow">COMO FUNCIONA</p>
          <h2 className="h2 fade-up" data-i18n="sp_flow_title">Fluxo inteligente de atendimento</h2>
          <div className="sp-flow">
            <div className="sp-flow-item fade-up">
              <div className="sp-fnum">1</div>
              <h3 data-i18n="sp_flow1_title">Cliente envia mensagem</h3>
              <p data-i18n="sp_flow1_desc">No WhatsApp, site ou app. A IA recebe e interpreta a pergunta imediatamente.</p>
            </div>
            <div className="sp-flow-item fade-up">
              <div className="sp-fnum">2</div>
              <h3 data-i18n="sp_flow2_title">IA consulta base de conhecimento</h3>
              <p data-i18n="sp_flow2_desc">Busca respostas na sua FAQ, documentação e histórico de atendimentos.</p>
            </div>
            <div className="sp-flow-item fade-up">
              <div className="sp-fnum">3</div>
              <h3 data-i18n="sp_flow3_title">Responde ou escalona</h3>
              <p data-i18n="sp_flow3_desc">Respostas simples são resolvidas na hora. Casos complexos são abertos como ticket para o time humano.</p>
            </div>
            <div className="sp-flow-item fade-up">
              <div className="sp-fnum">4</div>
              <h3 data-i18n="sp_flow4_title">Aprende e melhora</h3>
              <p data-i18n="sp_flow4_desc">Cada interação treina o modelo. O agente fica mais preciso a cada atendimento.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "var(--gap-xl)" }} className="fade-up">
            <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="sp_cta_seo">
              Garantir Acesso Antecipado — 1.000 créditos grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
