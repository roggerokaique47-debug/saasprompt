'use client';

import { useEffect, useState } from 'react';
import './status.css';
import Link from 'next/link';

export default function StatusPage() {
  const [lang, setLang] = useState('pt-BR');
  const [lastCheck, setLastCheck] = useState('');

  const PAGE_LANG: Record<string, any> = {
    'pt-BR': {
      st_eyebrow: 'STATUS', st_title: 'Status do Sistema', st_desc: 'Monitoramento em tempo real dos serviços NovaFlow AI.',
      st_all_good: 'Todos os sistemas operacionais', st_all_good_desc: 'Nenhum incidente relatado.',
      st_issues: 'Instabilidade Parcial', st_issues_desc: 'Nossa equipe está trabalhando para normalizar o serviço.',
      st_note: 'Status atualizado a cada 5 minutos.',
      st_cta_title: 'Precisando de ajuda?', st_cta_desc: 'Se algum serviço estiver fora do ar, entre em contato.', st_cta_btn: 'Central de Ajuda',
      operational: 'Operacional', degraded: 'Instável', uptime: 'Uptime',
    },
    en: {
      st_eyebrow: 'STATUS', st_title: 'System Status', st_desc: 'Real-time monitoring of NovaFlow AI services.',
      st_all_good: 'All systems operational', st_all_good_desc: 'No incidents reported.',
      st_issues: 'Partial Outage', st_issues_desc: 'Our team is working to normalize the service.',
      st_note: 'Status updated every 5 minutes.',
      st_cta_title: 'Need help?', st_cta_desc: 'If any service is down, contact our team.', st_cta_btn: 'Help Center',
      operational: 'Operational', degraded: 'Degraded', uptime: 'Uptime',
    },
    es: {
      st_eyebrow: 'ESTADO', st_title: 'Estado del Sistema', st_desc: 'Monitoreo en tiempo real de los servicios NovaFlow AI.',
      st_all_good: 'Todos los sistemas operativos', st_all_good_desc: 'Ningún incidente reportado.',
      st_issues: 'Inestabilidad Parcial', st_issues_desc: 'Nuestro equipo está trabajando para normalizar el servicio.',
      st_note: 'Estado actualizado cada 5 minutos.',
      st_cta_title: '¿Necesitas ayuda?', st_cta_desc: 'Si algún servicio está caído, contáctanos.', st_cta_btn: 'Centro de Ayuda',
      operational: 'Operativo', degraded: 'Inestable', uptime: 'Uptime',
    }
  };

  const SERVICES = [
    { name_pt: 'API Principal (NovaFlow)', name_en: 'Main API', name_es: 'API Principal', status: 'operational', uptime: '99.99%' },
    { name_pt: 'Motor de Workflows (Engine)', name_en: 'Workflow Engine', name_es: 'Motor de Workflows', status: 'operational', uptime: '99.98%' },
    { name_pt: 'WAHA (WhatsApp API)', name_en: 'WAHA (WhatsApp API)', name_es: 'WAHA (WhatsApp API)', status: 'operational', uptime: '99.95%' },
    { name_pt: 'Banco de Dados (Supabase)', name_en: 'Database (Supabase)', name_es: 'Base de Datos (Supabase)', status: 'operational', uptime: '100%' },
    { name_pt: 'Gateways de Pagamento (Stripe)', name_en: 'Payment Gateway (Stripe)', name_es: 'Pasarela de Pago (Stripe)', status: 'operational', uptime: '100%' },
  ];

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('novaflow-lang');
      if (storedLang) setLang(storedLang);
    } catch (e) {}

    const now = new Date();
    setLastCheck(now.toLocaleTimeString(lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es' : 'en-US', { hour: '2-digit', minute: '2-digit' }));

    const handleLangChange = () => {
      try {
        const storedLang = localStorage.getItem('novaflow-lang');
        if (storedLang) setLang(storedLang);
      } catch (e) {}
    };

    window.addEventListener('storage', handleLangChange);
    return () => window.removeEventListener('storage', handleLangChange);
  }, [lang]);

  const t = PAGE_LANG[lang] || PAGE_LANG['pt-BR'];
  const allOperational = SERVICES.every(s => s.status === 'operational');

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow fade-up text-accent">{t.st_eyebrow}</p>
          <h1 className="fade-up h1-hero">{t.st_title}</h1>
          <p className="lead fade-up">{t.st_desc}</p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container max-w-4xl mx-auto">
          
          <div className={`status-banner ${allOperational ? 'good' : 'warn'} fade-up mb-8`}>
            <div className="sb-icon">
              {allOperational ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">{allOperational ? t.st_all_good : t.st_issues}</h2>
              <p className="text-sm opacity-80">{allOperational ? t.st_all_good_desc : t.st_issues_desc}</p>
            </div>
          </div>

          <div className="service-list fade-up">
            {SERVICES.map((s, idx) => {
              const name = (s as any)[`name_${lang.split('-')[0]}`] || s.name_pt;
              return (
                <div key={idx} className="service-item">
                  <span className="service-name">{name}</span>
                  <div className="service-meta">
                    <span className={`service-status ${s.status}`}>
                      {s.status === 'operational' ? '●' : '◐'} {t[s.status]}
                    </span>
                    <span>{t.uptime}: {s.uptime}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="uptime-note fade-up text-center mt-6 text-sm opacity-60">
            {t.st_note} Última verificação: {lastCheck || 'agora'}.
          </p>

        </div>
      </section>

      <section className="section section-alt">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="h2 fade-up">{t.st_cta_title}</h2>
          <p className="lead fade-up mt-4 mb-8">{t.st_cta_desc}</p>
          <div className="hero-cta fade-up">
            <Link href="/ajuda" className="btn btn-primary btn-arrow">{t.st_cta_btn}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
