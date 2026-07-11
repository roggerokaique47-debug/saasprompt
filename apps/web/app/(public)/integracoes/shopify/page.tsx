'use client';

import Link from 'next/link';

export default function ShopifyIntegrationPage() {
  return (
    <main>
      <section className="int-page-hero">
        <div className="container">
          <div className="int-badge fade-up">INTEGRAÇÃO</div>
          <div className="int-logo fade-up text-6xl mb-6">🛒</div>
          <h1 className="fade-up">Shopify + WhatsApp: <span style={{ color: 'oklch(60% 0.22 240)' }}>E-commerce Ágil</span></h1>
          <p className="lead fade-up mx-auto">Conecte sua loja Shopify e recupere carrinhos abandonados, confirme pedidos e envie atualizações de rastreio direto pelo WhatsApp. Aumente seu faturamento recuperando vendas perdidas.</p>
          <div className="hero-cta fade-up mt-8">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow">Quero integrar Shopify + WhatsApp</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up">BENEFÍCIOS</p>
          <h2 className="h2 fade-up">O que você pode automatizar</h2>
          <div className="int-benefits mt-12">
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">🛒</div>
              <h3>Carrinho Abandonado</h3>
              <p>Envie uma mensagem amigável no WhatsApp 15 minutos após o cliente abandonar o carrinho. Ofereça um cupom e recupere a venda.</p>
            </div>
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">📦</div>
              <h3>Confirmação de Pedido</h3>
              <p>Assim que a compra for aprovada, envie o resumo do pedido e agradeça pela compra. Aumente a confiança na sua loja.</p>
            </div>
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">🚚</div>
              <h3>Rastreio de Entrega</h3>
              <p>Avise automaticamente quando o pedido for enviado, saiu para entrega e foi entregue. Reduza o suporte (WISMO).</p>
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
              <h3>Conecte a Loja</h3>
              <p>Instale o app não-listado ou adicione suas credenciais da API Shopify. É rápido e seguro.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">2</div>
              <h3>Escolha os eventos</h3>
              <p>Ex: Carrinho abandonado, pedido criado, status de envio atualizado. A NovaFlow detecta tudo.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">3</div>
              <h3>Crie o template</h3>
              <p>Use variáveis como {`{{cliente_nome}}`}, {`{{link_carrinho}}`} e {`{{nome_produto}}`} para personalizar a mensagem.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">4</div>
              <h3>Venda no piloto automático</h3>
              <p>Suas mensagens começam a ser enviadas automaticamente, convertendo abandonos em faturamento.</p>
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
