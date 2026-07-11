'use client';

import Link from 'next/link';

export default function StripeIntegrationPage() {
  return (
    <main>
      <section className="int-page-hero">
        <div className="container">
          <div className="int-badge fade-up">INTEGRAÇÃO</div>
          <div className="int-logo fade-up text-6xl mb-6">💳</div>
          <h1 className="fade-up">Stripe + WhatsApp: <span style={{ color: 'oklch(60% 0.22 240)' }}>Cobrança Inteligente</span></h1>
          <p className="lead fade-up mx-auto">Conecte sua conta Stripe e crie fluxos automáticos: notifique clientes sobre cobranças, recupere pagamentos vencidos e confirme recebimentos direto no WhatsApp. Tudo em tempo real, sem programação.</p>
          <div className="hero-cta fade-up mt-8">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow">Quero integrar Stripe + WhatsApp</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up">BENEFÍCIOS</p>
          <h2 className="h2 fade-up">O que você pode automatizar</h2>
          <div className="int-benefits mt-12">
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">🔔</div>
              <h3>Notificações de Cobrança</h3>
              <p>Envie avisos de cobrança no WhatsApp assim que a fatura for gerada. Taxa de abertura de 98% vs 20% do e-mail.</p>
            </div>
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">🔄</div>
              <h3>Recuperação de Boletos</h3>
              <p>Disparo automático quando um boleto vence ou um cartão é recusado. Recupere vendas que seriam perdidas.</p>
            </div>
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">✅</div>
              <h3>Confirmação de Pagamento</h3>
              <p>Avise o cliente automaticamente quando o pagamento for confirmado. Envie recibo, link de acesso ou código de ativação.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow fade-up">COMO CONECTAR</p>
          <h2 className="h2 fade-up">Conecte em 4 passos</h2>
          <div className="int-flow mt-12">
            <div className="int-flow-step fade-up">
              <div className="ifs-num">1</div>
              <h3>Conecte o Stripe</h3>
              <p>Adicione sua chave secreta do Stripe com um clique. Autenticação segura via OAuth.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">2</div>
              <h3>Escolha os eventos</h3>
              <p>Selecione invoice.payment_succeeded, payment_intent.failed, etc. A NovaFlow escuta os webhooks automaticamente.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">3</div>
              <h3>Monte a mensagem</h3>
              <p>Editor visual com variáveis dinâmicas: nome do cliente, valor, data de vencimento, link de boleto.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">4</div>
              <h3>Ative o fluxo</h3>
              <p>Pronto. A partir de agora, cada evento Stripe dispara uma mensagem personalizada no WhatsApp do cliente.</p>
            </div>
          </div>
          <div className="text-center mt-12 fade-up">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow">Garantir Acesso Antecipado — 1.000 créditos grátis</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
