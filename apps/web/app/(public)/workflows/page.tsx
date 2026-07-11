"use client";

import { useState } from "react";
import Link from "next/link";
import "./workflows.css";

const WORKFLOWS = [
  { title: 'Atendimento WhatsApp 24h', cat: 'whatsapp', desc: 'Agente IA que responde clientes, agenda e qualifica leads automaticamente.', downloads: '2.4k' },
  { title: 'Recuperação de Carrinho', cat: 'vendas', desc: 'Dispara WhatsApp 5 min após abandono de carrinho. Compatível com Shopify, Hotmart.', downloads: '1.8k' },
  { title: 'Nutrição de Leads por E-mail', cat: 'marketing', desc: 'Sequência automática de e-mails com IA que personaliza cada mensagem.', downloads: '1.2k' },
  { title: 'Suporte N1 com IA', cat: 'suporte', desc: 'Responde 80% das perguntas frequentes automaticamente. Transfere para humano quando necessário.', downloads: '3.1k' },
  { title: 'Cobrança por WhatsApp', cat: 'financeiro', desc: 'Envia lembretes de boleto/PIX vencido com link de pagamento.', downloads: '970' },
  { title: 'Agendamento Google Calendar', cat: 'vendas', desc: 'Cliente agenda consulta pelo WhatsApp. IA verifica disponibilidade e confirma.', downloads: '1.5k' },
  { title: 'Pós-venda Inteligente', cat: 'vendas', desc: 'Após compra, envia pesquisa de satisfação, cupom de desconto e monitora NPS.', downloads: '680' },
  { title: 'Moderação de Comunidade', cat: 'suporte', desc: 'Monitora grupos de WhatsApp e Telegram. Filtra spam e responde dúvidas comuns.', downloads: '520' },
  { title: 'Lead Capture WhatsApp', cat: 'marketing', desc: 'Captura leads que enviam "quero saber mais" no WhatsApp e adiciona ao CRM.', downloads: '2.0k' },
];

export default function WorkflowsPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filteredWorkflows = WORKFLOWS.filter((w) => {
    const matchFilter = filter === "all" || w.cat === filter;
    const matchQuery = !query || w.title.toLowerCase().includes(query.toLowerCase()) || w.desc.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="wf_eyebrow">WORKFLOWS PRONTOS</p>
          <h1 className="fade-up" data-i18n="wf_title">Automações prontas para usar</h1>
          <p className="lead fade-up" data-i18n="wf_desc">
            Dezenas de workflows de IA para WhatsApp, CRM, e-mail e muito mais. Importe e adapte em segundos.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="search-bar fade-up">
            <span style={{ color: "var(--muted)" }}>🔍</span>
            <input 
              type="search" 
              placeholder="Buscar workflows..." 
              data-i18n="wf_search_placeholder" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-bar fade-up">
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")} data-i18n="wf_all">Todos</button>
            <button className={`filter-btn ${filter === "whatsapp" ? "active" : ""}`} onClick={() => setFilter("whatsapp")}>WhatsApp</button>
            <button className={`filter-btn ${filter === "vendas" ? "active" : ""}`} onClick={() => setFilter("vendas")}>Vendas</button>
            <button className={`filter-btn ${filter === "marketing" ? "active" : ""}`} onClick={() => setFilter("marketing")}>Marketing</button>
            <button className={`filter-btn ${filter === "suporte" ? "active" : ""}`} onClick={() => setFilter("suporte")}>Suporte</button>
            <button className={`filter-btn ${filter === "financeiro" ? "active" : ""}`} onClick={() => setFilter("financeiro")}>Financeiro</button>
          </div>

          <div className="wf-grid">
            {filteredWorkflows.map((w, idx) => (
              <div key={idx} className="wf-card fade-up">
                <div className="wf-card-img">
                  <span>⚙️</span>
                </div>
                <div className="wf-card-body">
                  <div className="wf-tags">
                    <span className="wf-tag">{w.cat.toUpperCase()}</span>
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <div className="wf-meta">
                    <span>⬇ {w.downloads} downloads</span>
                  </div>
                  <Link href="/cadastro" className="btn btn-secondary">Usar Workflow</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="h2 fade-up" data-i18n="wf_cta_title">Não encontrou o que precisa?</h2>
          <p className="lead fade-up" style={{ margin: "var(--gap-md) auto" }} data-i18n="wf_cta_desc">
            Crie seu próprio workflow do zero com nosso construtor visual. É mais fácil do que parece.
          </p>
          <div className="hero-cta fade-up">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow" data-i18n="wf_cta_btn">
              Criar workflow grátis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
