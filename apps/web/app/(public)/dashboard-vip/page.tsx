'use client';

import { useEffect, useState } from 'react';
import './dashboard-vip.css';

export default function DashboardVIPPage() {
  const [lang, setLang] = useState('pt-BR');
  const [leads, setLeads] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('novaflow-lang');
      if (storedLang) setLang(storedLang);
      
      const storedLeads = localStorage.getItem('novaflow-vip');
      let parsedLeads = [];
      if (storedLeads) {
        const parsed = JSON.parse(storedLeads);
        parsedLeads = Array.isArray(parsed) ? parsed : [parsed];
        setLeads(parsedLeads);
      }

      let parsedHistory = [];
      const storedHistory = localStorage.getItem('novaflow-vip-history');
      if (storedHistory) {
        parsedHistory = JSON.parse(storedHistory);
      }

      // Initialize history if empty
      const now = new Date();
      if (parsedHistory.length === 0) {
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          parsedHistory.push({ date: d.toISOString().slice(0,10), count: 0 });
        }
      }

      // Update today
      const todayStr = now.toISOString().slice(0,10);
      let todayEntry = parsedHistory.find((h: any) => h.date === todayStr);
      if (todayEntry) {
        const todayLeadsCount = parsedLeads.filter((l: any) => l.date && l.date.slice(0,10) === todayStr).length;
        if (todayEntry.count < todayLeadsCount) {
          todayEntry.count = todayLeadsCount;
        }
      }

      setHistory(parsedHistory);
      localStorage.setItem('novaflow-vip-history', JSON.stringify(parsedHistory));
    } catch (e) {}
  }, []);

  const total = leads.length;
  const todayEntry = history.find(h => h.date === new Date().toISOString().slice(0,10));
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  const yesterdayCount = (history.find(h => h.date === yesterdayStr) || { count: 0 }).count;

  const maxChartVal = Math.max(...history.map(h => h.count), 1);
  const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  return (
    <main>
      <section className="db-hero">
        <div className="container">
          <p className="eyebrow fade-up" style={{ color: 'oklch(58% 0.20 150)' }}>PRÉ-LANÇAMENTO</p>
          <h1 className="fade-up h1-hero">Painel de Métricas</h1>
          <p className="lead fade-up mx-auto">Acompanhe a captação de leads, conversão da landing e aquecimento da lista de espera.</p>
        </div>
      </section>

      <section className="section db-section">
        <div className="container">
          <div className="db-grid fade-up">
            <div className="db-card">
              <div className="db-label">Total de Leads</div>
              <div className="db-num">{total}</div>
              <div className="db-sub">cadastrados</div>
            </div>
            <div className="db-card">
              <div className="db-label">Hoje</div>
              <div className="db-num">{todayEntry ? todayEntry.count : 0}</div>
              <div className="db-sub">novos leads</div>
            </div>
            <div className="db-card">
              <div className="db-label">Taxa de Conversão</div>
              <div className="db-num">{total > 0 ? '—' : '0%'}</div>
              <div className="db-sub">visitantes → lead</div>
            </div>
            <div className="db-card">
              <div className="db-label">Últimas 24h</div>
              <div className="db-num">{yesterdayCount}</div>
              <div className="db-sub">ontem</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt db-section">
        <div className="container">
          <h2 className="fade-up">Crescimento da Lista (últimos 7 dias)</h2>
          <div className="db-chart fade-up">
            {history.length === 0 ? (
              <div className="db-empty-state"><h3>Nenhum dado ainda</h3></div>
            ) : (
              <>
                <div className="db-chart-bar-wrapper">
                  {history.map((h, i) => {
                    const height = Math.max((h.count / maxChartVal) * 160, 8);
                    return (
                      <div key={i} className="db-chart-bar" style={{ height: `${height}px`, background: `color-mix(in oklch, var(--accent) ${20 + (h.count/maxChartVal)*60}%, var(--surface-alt))` }}>
                        <span className="bar-val">{h.count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="db-chart-x">
                  {history.map((h, i) => {
                    const d = new Date(h.date + 'T12:00:00');
                    return <span key={i}>{dayNames[d.getDay()]}</span>;
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section db-section">
        <div className="container">
          <h2 className="fade-up">Últimos Cadastros VIP</h2>
          {leads.length === 0 ? (
            <div className="db-empty-state fade-up">
              <div className="db-empty-icon">📭</div>
              <h3>Nenhum lead capturado ainda</h3>
              <p>Os cadastros da Lista VIP aparecerão aqui em tempo real, armazenados no navegador.</p>
            </div>
          ) : (
            <table className="db-table fade-up">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice().reverse().map((l, idx) => (
                  <tr key={idx}>
                    <td>{l.name || '—'}</td>
                    <td>{l.email || '—'}</td>
                    <td>{l.date ? new Date(l.date).toLocaleString('pt-BR') : '—'}</td>
                    <td style={{ color: 'oklch(58% 0.20 150)' }}>Na fila</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="section section-alt db-section">
        <div className="container">
          <h2 className="fade-up">Checklist de Lançamento</h2>
          <ul className="db-checklist fade-up">
            <li className="done">Landing page com captura de e-mail publicada</li>
            <li className="done">Páginas de SEO (soluções e integrações) criadas</li>
            <li className="done">Formulário VIP funcional com salvamento local</li>
            <li className="done">Painel de métricas de pré-lançamento operacional</li>
            <li>Sequência de e-mails de aquecimento configurada</li>
            <li>Anúncios de teste rodando (Instagram / Google)</li>
            <li>Página de login e cadastro protegida</li>
            <li>Conteúdo do blog publicado (artigos de SEO)</li>
            <li>Landing page em 3 idiomas (PT/EN/ES)</li>
            <li>Editor de workflows funcional para lançamento</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
