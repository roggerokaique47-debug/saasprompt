"use client";

import { useState } from "react";
import Link from "next/link";
import "./preco.css"; // Import the custom CSS

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow fade-up" data-i18n="pricing_eyebrow">PREÇOS</p>
          <h1 className="fade-up" data-i18n="pricing_title">Planos simples e transparentes</h1>
          <p className="lead fade-up" data-i18n="pricing_desc">
            Comece grátis e escale conforme sua necessidade. Sem cartão de crédito.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="section">
        <div className="container">
          <div className="pricing-grid">
            <div className="plan-card fade-up">
              <div className="plan-name" data-i18n="plan_free_name">Free</div>
              <div className="plan-price">R$ 0 <small>/mês</small></div>
              <div className="plan-desc" data-i18n="plan_free_desc">Para começar a explorar automações</div>
              <ul className="plan-features" data-i18n="plan_free_features">
                <li>Até 100 execuções/mês</li>
                <li>5 workflows ativos</li>
                <li>10 integrações básicas</li>
                <li>Templates da comunidade</li>
                <li>1 Funcionário de IA</li>
                <li>Suporte por email</li>
              </ul>
              <Link href="/#vip-form" className="btn btn-primary" data-i18n="plan_free_cta">Garantir Acesso Antecipado</Link>
            </div>

            <div className="plan-card featured fade-up" data-badge="MAIS POPULAR">
              <div className="plan-name" data-i18n="plan_pro_name">Pro</div>
              <div className="plan-price">R$ 97 <small>/mês</small></div>
              <div className="plan-desc" data-i18n="plan_pro_desc">Para profissionais e pequenas empresas</div>
              <ul className="plan-features" data-i18n="plan_pro_features">
                <li>Execuções ilimitadas</li>
                <li>Workflows ilimitados</li>
                <li>Todas as 80+ integrações</li>
                <li>Templates premium inclusos</li>
                <li>IA que cria workflows</li>
                <li>Funcionários de IA ilimitados</li>
                <li>Analytics avançado</li>
                <li>Suporte prioritário</li>
                <li>Sem marca d'água</li>
              </ul>
              <Link href="/#vip-form" className="btn btn-primary btn-glow" data-i18n="plan_pro_cta">Garantir Desconto de Lançamento</Link>
            </div>

            <div className="plan-card fade-up">
              <div className="plan-name" data-i18n="plan_enterprise_name">Enterprise</div>
              <div className="plan-price" data-i18n="plan_enterprise_price">Sob consulta</div>
              <div className="plan-desc" data-i18n="plan_enterprise_desc">Para grandes equipes e demandas específicas</div>
              <ul className="plan-features" data-i18n="plan_enterprise_features">
                <li>Tudo do Pro</li>
                <li>SSO e SAML</li>
                <li>Deploy on-premise</li>
                <li>SLA garantido</li>
                <li>Gerente de conta dedicado</li>
                <li>Treinamento personalizado</li>
                <li>API dedicada</li>
                <li>Auditoria e compliance</li>
              </ul>
              <Link href="/cadastro" className="btn btn-secondary" data-i18n="plan_enterprise_cta">Falar com Vendas</Link>
            </div>

            <div className="plan-card fade-up">
              <div className="plan-name" data-i18n="plan_lifetime_name">Lifetime (Founder)</div>
              <div className="plan-price">R$ 997 <small data-i18n="plan_lifetime_period">/único</small></div>
              <div className="plan-desc" data-i18n="plan_lifetime_desc">Acesso vitalício ao plano Pro. Limitado aos 100 primeiros.</div>
              <ul className="plan-features" data-i18n="plan_lifetime_features">
                <li>Tudo do Pro para SEMPRE</li>
                <li>Pague 1x, use para sempre</li>
                <li>Acesso antecipado a novas features</li>
                <li>Selo de Sócio-Fundador</li>
                <li>Suporte via WhatsApp</li>
              </ul>
              <Link href="/cadastro" className="btn btn-primary" data-i18n="plan_lifetime_cta">Garantir Acesso Vitalício</Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="h2 fade-up" style={{ textAlign: "center", marginBottom: "var(--gap-md)" }} data-i18n="compare_title">Comparação detalhada</h2>
          <p className="lead fade-up" style={{ textAlign: "center", marginInline: "auto" }} data-i18n="compare_desc">Veja exatamente o que cada plano oferece.</p>
          <div className="compare-table-wrap" style={{ overflowX: "auto" }}>
            <table className="compare-table fade-up">
              <thead>
                <tr>
                  <th data-i18n="compare_feature">Funcionalidade</th>
                  <th>Free</th>
                  <th>Pro</th>
                  <th data-i18n="compare_enterprise">Enterprise</th>
                  <th data-i18n="compare_lifetime">Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr><td data-i18n="comp_exec">Execuções/mês</td><td>100</td><td className="yes">Ilimitado</td><td className="yes">Ilimitado</td><td className="yes">Ilimitado</td></tr>
                <tr><td data-i18n="comp_wf">Workflows ativos</td><td>5</td><td className="yes">Ilimitado</td><td className="yes">Ilimitado</td><td className="yes">Ilimitado</td></tr>
                <tr><td data-i18n="comp_integ">Integrações</td><td>10 básicas</td><td className="yes">80+</td><td className="yes">80+</td><td className="yes">80+</td></tr>
                <tr><td data-i18n="comp_ai_wf">IA cria workflows</td><td>—</td><td className="yes">✓</td><td className="yes">✓</td><td className="yes">✓</td></tr>
                <tr><td data-i18n="comp_agents">Agentes de IA</td><td>1</td><td className="yes">Ilimitado</td><td className="yes">Ilimitado</td><td className="yes">Ilimitado</td></tr>
                <tr><td data-i18n="comp_analytics">Analytics avançado</td><td>—</td><td className="yes">✓</td><td className="yes">✓</td><td className="yes">✓</td></tr>
                <tr><td data-i18n="comp_support">Suporte</td><td>Email</td><td>Prioritário</td><td>Dedicado</td><td>WhatsApp</td></tr>
                <tr><td data-i18n="comp_white_label">White label</td><td>—</td><td>—</td><td className="yes">✓</td><td>—</td></tr>
                <tr><td data-i18n="comp_sso">SSO / SAML</td><td>—</td><td>—</td><td className="yes">✓</td><td>—</td></tr>
                <tr><td data-i18n="comp_onprem">Deploy on-premise</td><td>—</td><td>—</td><td className="yes">✓</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <h2 className="h2 fade-up" style={{ textAlign: "center", marginBottom: "var(--gap-xl)" }} data-i18n="faq_title">Perguntas frequentes</h2>
          <div className="faq-list">
            <div className={`faq-item fade-up ${openFaq === 0 ? "open" : ""}`}>
              <button className="faq-q" onClick={() => toggleFaq(0)} data-i18n="faq1_q">Posso mudar de plano depois?</button>
              <div className="faq-a" data-i18n="faq1_a">Sim! Você pode fazer upgrade ou downgrade a qualquer momento. A diferença é proporcional ao período já utilizado.</div>
            </div>
            <div className={`faq-item fade-up ${openFaq === 1 ? "open" : ""}`}>
              <button className="faq-q" onClick={() => toggleFaq(1)} data-i18n="faq2_q">Como funciona o período de teste?</button>
              <div className="faq-a" data-i18n="faq2_a">O plano Free é totalmente gratuito e sem limite de tempo. Você pode testar todas as funcionalidades básicas e migrar quando precisar.</div>
            </div>
            <div className={`faq-item fade-up ${openFaq === 2 ? "open" : ""}`}>
              <button className="faq-q" onClick={() => toggleFaq(2)} data-i18n="faq3_q">O que acontece se eu exceder o limite do Free?</button>
              <div className="faq-a" data-i18n="faq3_a">Seus workflows continuam funcionando normalmente. Você receberá uma notificação ao atingir 80% do limite para fazer upgrade.</div>
            </div>
            <div className={`faq-item fade-up ${openFaq === 3 ? "open" : ""}`}>
              <button className="faq-q" onClick={() => toggleFaq(3)} data-i18n="faq4_q">Aceitam pagamento por boleto ou PIX?</button>
              <div className="faq-a" data-i18n="faq4_a">Sim! Aceitamos cartão de crédito, PIX e boleto bancário. Pagamentos anuais têm 15% de desconto.</div>
            </div>
            <div className={`faq-item fade-up ${openFaq === 4 ? "open" : ""}`}>
              <button className="faq-q" onClick={() => toggleFaq(4)} data-i18n="faq5_q">O plano Lifetime realmente é vitalício?</button>
              <div className="faq-a" data-i18n="faq5_a">Sim. Você paga uma única vez e tem acesso ao plano Pro para sempre, incluindo todas as atualizações futuras. Limitado aos 100 primeiros clientes.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-alt" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className="h2 fade-up" data-i18n="cta_title_free">Garanta seu desconto de lançamento</h2>
          <p className="lead fade-up" style={{ margin: "var(--gap-md) auto" }} data-i18n="cta_desc_free">Os 100 primeiros cadastros ganham 1.000 créditos gratuitos vitalícios. Entre para a lista VIP e seja avisado primeiro.</p>
          <div className="hero-cta fade-up">
            <Link href="/#vip-form" className="btn btn-primary btn-glow btn-arrow" data-i18n="cta_btn_free">Garantir Acesso Antecipado</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
