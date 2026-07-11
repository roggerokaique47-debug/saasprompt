'use client';

import { useEffect, useState } from 'react';
import './integracoes.css';
import Link from 'next/link';

export default function IntegracoesPage() {
  const [lang, setLang] = useState('pt-BR');
  const [currentFilter, setCurrentFilter] = useState('all');

  const PAGE_LANG: Record<string, any> = {
    'pt-BR': {
      int_eyebrow: 'INTEGRAÇÕES', int_title: 'Conecte suas ferramentas favoritas', int_desc: 'Mais de 80 integrações nativas. WhatsApp, CRM, e-mail, bancos de dados e centenas de APIs.',
      int_cta_title: 'Precisa de uma integração específica?', int_cta_desc: 'Temos API pública e webhooks. Conecte qualquer ferramenta via API personalizada.', int_cta_btn: 'Começar a integrar',
      int_featured_eyebrow: 'INTEGRAÇÕES EM DESTAQUE', int_featured_title: 'Páginas detalhadas de integração',
      int_card_stripe: 'Cobranças e notificações no WhatsApp', int_card_shopify: 'Carrinho abandonado e pedidos no WhatsApp', int_card_sheets: 'Planilhas automatizadas com IA',
      all: 'Todas', messaging: 'Mensageria', crm_sales: 'CRM & Vendas', email_mkt: 'E-mail & Marketing', database: 'Banco de Dados', payments: 'Pagamentos', productivity: 'Produtividade',
    }
  };

  const INTEGRATIONS = [
    { name: 'WhatsApp', cat: 'messaging', icon: '💬', color: '#25D366' },
    { name: 'Telegram', cat: 'messaging', icon: '✈️', color: '#0088cc' },
    { name: 'Messenger', cat: 'messaging', icon: '💙', color: '#1877F2' },
    { name: 'Slack', cat: 'messaging', icon: '🔷', color: '#4A154B' },
    { name: 'Discord', cat: 'messaging', icon: '🎮', color: '#5865F2' },
    { name: 'HubSpot', cat: 'crm_sales', icon: '🟠', color: '#FF7A59' },
    { name: 'Salesforce', cat: 'crm_sales', icon: '☁️', color: '#00A1E0' },
    { name: 'Pipedrive', cat: 'crm_sales', icon: '📈', color: '#203E5A' },
    { name: 'RD Station', cat: 'crm_sales', icon: '🚀', color: '#EF4123' },
    { name: 'ActiveCampaign', cat: 'email_mkt', icon: '📧', color: '#1B6B9A' },
    { name: 'Mailchimp', cat: 'email_mkt', icon: '🐵', color: '#FFE01B' },
    { name: 'SendGrid', cat: 'email_mkt', icon: '📨', color: '#7D46C0' },
    { name: 'Google Sheets', cat: 'database', icon: '📊', color: '#0F9D58' },
    { name: 'Supabase', cat: 'database', icon: '🔥', color: '#3DC79A' },
    { name: 'MySQL', cat: 'database', icon: '🐬', color: '#00758F' },
    { name: 'PostgreSQL', cat: 'database', icon: '🐘', color: '#336791' },
    { name: 'Stripe', cat: 'payments', icon: '💳', color: '#6772E5' },
    { name: 'Mercado Pago', cat: 'payments', icon: '🅼', color: '#009EE3' },
    { name: 'Asaas', cat: 'payments', icon: '💲', color: '#249253' },
    { name: 'Google Calendar', cat: 'productivity', icon: '📅', color: '#4285F4' },
    { name: 'Notion', cat: 'productivity', icon: '📝', color: '#000000' },
    { name: 'Trello', cat: 'productivity', icon: '📋', color: '#0079BF' },
  ];

  const CATEGORIES = ['messaging', 'crm_sales', 'email_mkt', 'database', 'payments', 'productivity'];
  const TAGS = ['all', ...CATEGORIES];

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('novaflow-lang');
      if (storedLang && PAGE_LANG[storedLang]) setLang(storedLang);
    } catch (e) {}

    const handleLangChange = () => {
      try {
        const storedLang = localStorage.getItem('novaflow-lang');
        if (storedLang && PAGE_LANG[storedLang]) setLang(storedLang);
      } catch (e) {}
    };

    window.addEventListener('storage', handleLangChange);
    return () => window.removeEventListener('storage', handleLangChange);
  }, []);

  const t = PAGE_LANG[lang] || PAGE_LANG['pt-BR'];

  const renderGrid = (items: typeof INTEGRATIONS) => (
    <div className="int-grid">
      {items.map((i, idx) => (
        <div key={idx} className="int-card fade-up">
          <div className="int-icon" style={{ background: `${i.color}22`, color: i.color }}>
            {i.icon}
          </div>
          <h3>{i.name}</h3>
        </div>
      ))}
    </div>
  );

  return (
    <main>
      <section className="int-hero">
        <div className="container">
          <p className="eyebrow fade-up text-accent">{t.int_eyebrow}</p>
          <h1 className="fade-up h1-hero">{t.int_title}</h1>
          <p className="lead fade-up mx-auto">{t.int_desc}</p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="int-tags fade-up mb-12">
            {TAGS.map(tag => (
              <button
                key={tag}
                className={`int-tag ${currentFilter === tag ? 'active' : ''}`}
                onClick={() => setCurrentFilter(tag)}
              >
                {t[tag]}
              </button>
            ))}
          </div>

          <div id="int-categories">
            {currentFilter !== 'all' ? (
              renderGrid(INTEGRATIONS.filter(i => i.cat === currentFilter))
            ) : (
              CATEGORIES.map(cat => (
                <div key={cat} className="int-category">
                  <h2 className="h2">{t[cat]}</h2>
                  {renderGrid(INTEGRATIONS.filter(i => i.cat === cat))}
                </div>
              ))
            )}
          </div>

          <div className="mt-20 fade-up">
            <p className="eyebrow">{t.int_featured_eyebrow}</p>
            <h2 className="h2">{t.int_featured_title}</h2>
            <div className="int-grid mt-8">
              <Link href="/integracoes/stripe" className="int-card block no-underline hover:-translate-y-1 transition-all">
                <div className="int-icon" style={{ background: 'oklch(55% 0.18 240 / 0.12)' }}>💳</div>
                <h3>Stripe</h3>
                <p>{t.int_card_stripe}</p>
              </Link>
              <Link href="/integracoes/shopify" className="int-card block no-underline hover:-translate-y-1 transition-all">
                <div className="int-icon" style={{ background: 'oklch(55% 0.18 30 / 0.12)' }}>🛒</div>
                <h3>Shopify</h3>
                <p>{t.int_card_shopify}</p>
              </Link>
              <Link href="/integracoes/google-sheets" className="int-card block no-underline hover:-translate-y-1 transition-all">
                <div className="int-icon" style={{ background: 'oklch(55% 0.18 160 / 0.12)' }}>📊</div>
                <h3>Google Sheets</h3>
                <p>{t.int_card_sheets}</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt text-center">
        <div className="container max-w-2xl mx-auto">
          <h2 className="h2 fade-up">{t.int_cta_title}</h2>
          <p className="lead fade-up mt-4 mb-8">{t.int_cta_desc}</p>
          <div className="hero-cta fade-up">
            <Link href="/cadastro" className="btn btn-primary btn-glow btn-arrow">{t.int_cta_btn}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
