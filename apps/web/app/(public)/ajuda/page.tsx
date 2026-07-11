"use client";

import { useState } from "react";
import Link from "next/link";
import "./ajuda.css";

export default function AjudaPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="help_eyebrow">AJUDA</p>
          <h1 className="fade-up" data-i18n="help_title">Como podemos ajudar?</h1>
          <p className="lead fade-up" data-i18n="help_desc">FAQ, documentação e contato com nosso time de suporte.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="help-tabs fade-up">
            <button 
              className={`help-tab ${activeTab === "faq" ? "active" : ""}`} 
              onClick={() => setActiveTab("faq")} 
              data-i18n="help_tab_faq"
            >
              FAQ
            </button>
            <button 
              className={`help-tab ${activeTab === "docs" ? "active" : ""}`} 
              onClick={() => setActiveTab("docs")} 
              data-i18n="help_tab_docs"
            >
              Documentação
            </button>
            <button 
              className={`help-tab ${activeTab === "support" ? "active" : ""}`} 
              onClick={() => setActiveTab("support")} 
              data-i18n="help_tab_support"
            >
              Fale Conosco
            </button>
          </div>

          <div className={`help-panel ${activeTab === "faq" ? "active" : ""}`} id="panel-faq">
            <div className="faq-list" style={{ maxWidth: "720px", marginInline: "auto" }}>
              {[
                {
                  q: "O que são créditos e como funcionam?",
                  a: "Cada execução de nó do seu workflow consome créditos. Você ganha 100 créditos grátis ao se cadastrar. Planos Pro têm execuções ilimitadas."
                },
                {
                  q: "Como conectar meu WhatsApp?",
                  a: "Vá em Integrações > WhatsApp e escaneie o QR Code com seu celular. Não precisa de API da Meta. Funciona com WhatsApp comum e Business."
                },
                {
                  q: "Posso usar minha própria chave da OpenAI?",
                  a: "Sim! No plano Enterprise, você pode usar sua própria chave (BYOK). As chamadas de IA serão cobradas diretamente da sua conta."
                },
                {
                  q: "O que é um Funcionário de IA?",
                  a: "É um agente inteligente que executa tarefas específicas: atendimento, vendas, suporte, etc. Cada funcionário pode ter múltiplos workflows associados."
                },
                {
                  q: "Como funciona o período gratuito?",
                  a: "O plano Free é vitalício e sem cartão de crédito. Você pode testar todas as funcionalidades básicas e fazer upgrade quando precisar de mais."
                },
                {
                  q: "Posso cancelar minha assinatura?",
                  a: "Sim, a qualquer momento. Seu plano continua ativo até o final do período já pago. Sem multa ou burocracia."
                }
              ].map((faq, idx) => (
                <div key={idx} className={`faq-item fade-up ${openFaq === idx ? "open" : ""}`}>
                  <button className="faq-q" onClick={() => toggleFaq(idx)}>{faq.q}</button>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`help-panel ${activeTab === "docs" ? "active" : ""}`} id="panel-docs">
            <div className="doc-list">
              <div className="doc-card fade-up">
                <div className="doc-icon">🚀</div>
                <h3 data-i18n="help_doc1">Primeiros passos</h3>
                <p data-i18n="help_doc1_desc">Aprenda a criar seu primeiro workflow em 5 minutos.</p>
              </div>
              <div className="doc-card fade-up">
                <div className="doc-icon">💬</div>
                <h3 data-i18n="help_doc2">WhatsApp WAHA</h3>
                <p data-i18n="help_doc2_desc">Configure e gerencie sua conexão WhatsApp.</p>
              </div>
              <div className="doc-card fade-up">
                <div className="doc-icon">🧩</div>
                <h3 data-i18n="help_doc3">Editor de Fluxos</h3>
                <p data-i18n="help_doc3_desc">Domine o construtor visual de automações.</p>
              </div>
              <div className="doc-card fade-up">
                <div className="doc-icon">🔗</div>
                <h3 data-i18n="help_doc4">Integrações</h3>
                <p data-i18n="help_doc4_desc">Conecte CRM, e-mail, planilhas e APIs externas.</p>
              </div>
              <div className="doc-card fade-up">
                <div className="doc-icon">🤖</div>
                <h3 data-i18n="help_doc5">Agentes de IA</h3>
                <p data-i18n="help_doc5_desc">Configure prompts, contexto e regras dos seus agentes.</p>
              </div>
              <div className="doc-card fade-up">
                <div className="doc-icon">💰</div>
                <h3 data-i18n="help_doc6">Planos e Faturamento</h3>
                <p data-i18n="help_doc6_desc">Tire dúvidas sobre planos, créditos e pagamentos.</p>
              </div>
            </div>
          </div>

          <div className={`help-panel ${activeTab === "support" ? "active" : ""}`} id="panel-support">
            <div className="support-options fade-up">
              <div className="support-card">
                <div className="sc-icon">💬</div>
                <h3 data-i18n="help_sup1">WhatsApp</h3>
                <p data-i18n="help_sup1_desc">Suporte rápido para planos Pro e Enterprise.</p>
                <Link href="/cadastro" className="btn btn-primary" data-i18n="help_sup1_cta">Falar agora</Link>
              </div>
              <div className="support-card">
                <div className="sc-icon">📧</div>
                <h3 data-i18n="help_sup2">E-mail</h3>
                <p data-i18n="help_sup2_desc">Respondemos em até 24h úteis.</p>
                <a href="mailto:suporte@novaflow.ai" className="btn btn-secondary">suporte@novaflow.ai</a>
              </div>
              <div className="support-card">
                <div className="sc-icon">📖</div>
                <h3 data-i18n="help_sup3">Base de Conhecimento</h3>
                <p data-i18n="help_sup3_desc">Guias, tutoriais e artigos detalhados.</p>
                <a href="#" className="btn btn-secondary" data-i18n="help_sup3_cta">Acessar</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
