'use client';

import Link from 'next/link';

export default function GoogleSheetsIntegrationPage() {
  return (
    <main>
      <section className="int-page-hero">
        <div className="container">
          <div className="int-badge fade-up">INTEGRAÇÃO</div>
          <div className="int-logo fade-up text-6xl mb-6">📊</div>
          <h1 className="fade-up">Google Sheets + WhatsApp: <span style={{ color: 'oklch(60% 0.22 240)' }}>Planilhas que Falam</span></h1>
          <p className="lead fade-up mx-auto">Transforme suas planilhas do Google em um banco de dados ativo. Envie mensagens no WhatsApp quando uma nova linha for adicionada, ou salve respostas de clientes direto na planilha.</p>
          <div className="hero-cta fade-up mt-8">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow">Quero integrar Sheets + WhatsApp</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow fade-up">BENEFÍCIOS</p>
          <h2 className="h2 fade-up">O que você pode automatizar</h2>
          <div className="int-benefits mt-12">
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">📝</div>
              <h3>Boas-vindas Automáticas</h3>
              <p>Quando uma nova linha (lead) for adicionada à planilha (ex: via Typeform ou Zapier), dispare uma mensagem de WhatsApp imediatamente.</p>
            </div>
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">💾</div>
              <h3>Salvar Respostas do Chat</h3>
              <p>Pergunte dados ao cliente pelo WhatsApp usando nosso bot inteligente, e salve as respostas (nome, email, CPF) diretamente em colunas do Sheets.</p>
            </div>
            <div className="int-benefit-card fade-up">
              <div className="ib-icon">📅</div>
              <h3>Lembretes Diários</h3>
              <p>Agende rotinas que leem uma planilha de agendamentos e enviam lembretes 24h antes do compromisso pelo WhatsApp.</p>
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
              <h3>Conecte o Google</h3>
              <p>Faça login com sua conta Google com apenas um clique. Sem complicação.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">2</div>
              <h3>Selecione a Planilha</h3>
              <p>Escolha o arquivo do Sheets e a aba que você quer monitorar ou atualizar.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">3</div>
              <h3>Mapeie as Colunas</h3>
              <p>Vincule as colunas da planilha (Nome, Telefone) com as variáveis da sua mensagem de WhatsApp.</p>
            </div>
            <div className="int-flow-step fade-up">
              <div className="ifs-num">4</div>
              <h3>Automatize</h3>
              <p>Seus dados agora fluem livremente entre planilhas e o celular dos seus clientes, sem trabalho manual.</p>
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
