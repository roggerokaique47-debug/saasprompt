"use client";

import Link from "next/link";
import "./biblioteca.css";

const TEMPLATES = [
  { title: 'Agente WhatsApp Pro', icon: '💬', desc: 'Atendimento 24h com IA, agendamento e qualificação de leads.', downloads: '3.2k', rating: '4.8' },
  { title: 'Email Marketing Automático', icon: '📧', desc: 'Sequência de nutrição com personalização por IA. Integra com Mailchimp.', downloads: '1.9k', rating: '4.6' },
  { title: 'Suporte Técnico N1', icon: '🎧', desc: 'Responde 80% das dúvidas frequentes. Transfere para humano se necessário.', downloads: '2.7k', rating: '4.9' },
  { title: 'Recuperação de Vendas', icon: '🛒', desc: 'Dispara WhatsApp para carrinho abandonado. Shopify, Hotmart, Kiwify.', downloads: '1.8k', rating: '4.7' },
  { title: 'Agendamento Online', icon: '📅', desc: 'Clientes agendam pelo WhatsApp com verificação de disponibilidade.', downloads: '1.5k', rating: '4.5' },
  { title: 'CRM Automático', icon: '📊', desc: 'Adiciona leads automaticamente ao CRM e dispara sequência de vendas.', downloads: '2.1k', rating: '4.8' },
];

export default function BibliotecaPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="bib_eyebrow">BIBLIOTECA</p>
          <h1 className="fade-up" data-i18n="bib_title">Marketplace de templates</h1>
          <p className="lead fade-up" data-i18n="bib_desc">Descubra centenas de workflows, agentes e integrações prontas para acelerar seu negócio.</p>
          <div className="search-section fade-up">
            <form className="tpl-search" action="/biblioteca">
              <span style={{ color: "var(--muted)" }}>🔍</span>
              <input type="search" name="q" placeholder="Buscar templates..." data-i18n="bib_search" />
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="h3 fade-up" style={{ marginBottom: "var(--gap-md)" }} data-i18n="bib_categories">Categorias</h2>
          <div className="cat-grid">
            <div className="cat-card fade-up">
              <div className="cat-icon">💬</div>
              <h3>WhatsApp</h3>
              <p data-i18n="bib_cat1">Automação de atendimento e vendas</p>
            </div>
            <div className="cat-card fade-up">
              <div className="cat-icon">📧</div>
              <h3>E-mail</h3>
              <p data-i18n="bib_cat2">Marketing e sequências de e-mail</p>
            </div>
            <div className="cat-card fade-up">
              <div className="cat-icon">🤖</div>
              <h3>Agentes IA</h3>
              <p data-i18n="bib_cat3">Assistentes inteligentes prontos</p>
            </div>
            <div className="cat-card fade-up">
              <div className="cat-icon">🔗</div>
              <h3>Integrações</h3>
              <p data-i18n="bib_cat4">CRM, ERP, planilhas e mais</p>
            </div>
          </div>

          <h2 className="h3 fade-up" style={{ marginBottom: "var(--gap-md)" }} data-i18n="bib_popular">Templates em destaque</h2>
          <div className="template-grid">
            {TEMPLATES.map((t, idx) => (
              <div key={idx} className="tpl-card fade-up">
                <div className="tpl-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <div className="tpl-meta">
                  <span>⬇ {t.downloads}</span>
                  <span>★ {t.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="h2 fade-up" data-i18n="bib_cta_title">Quer publicar seu template?</h2>
          <p className="lead fade-up" style={{ margin: "var(--gap-md) auto" }} data-i18n="bib_cta_desc">
            Criadores podem publicar workflows na comunidade e ganhar comissão por cada download.
          </p>
          <div className="hero-cta fade-up">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow" data-i18n="bib_cta_btn">
              Criar e publicar
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
