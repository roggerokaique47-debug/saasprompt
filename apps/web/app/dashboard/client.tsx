"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

const AI_SUGGESTIONS = [
  "Quero responder clientes do WhatsApp com IA...",
  "Automatizar relatórios semanais no Google Sheets...",
  "Enviar notificação no Slack quando chegar um lead...",
  "Recuperar carrinhos abandonados no Shopify...",
  "Criar um agente de suporte para e-mail...",
];

export function AiPromptBar() {
  const [prompt, setPrompt] = useState('');
  const [placeholder, setPlaceholder] = useState(AI_SUGGESTIONS[0]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % AI_SUGGESTIONS.length;
      setPlaceholder(AI_SUGGESTIONS[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    localStorage.setItem('ai_initial_prompt', prompt);
    router.push('/dashboard/workflows/novo/edit');
  };

  return (
    <form onSubmit={handleSubmit} className="ai-prompt-bar">
      <div className={`ai-prompt-inner ${isFocused ? 'focused' : ''}`}>
        <span className="ai-prompt-icon">✨</span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="ai-prompt-input"
          aria-label="O que você quer automatizar hoje?"
        />
        <button type="submit" className="ai-prompt-btn" disabled={!prompt.trim()}>
          Criar Automação →
        </button>
      </div>
    </form>
  );
}

export function AnalyticsClient({ kpi, mrrSeries, timelineSeries, timelineLabels, cohortLabels, cohortData, customers }: any) {

  useEffect(() => {
    // ─── KPI ─────────────────────────────────────────────────────
    function renderKPI() {
      const row = document.getElementById('kpi-row');
      if (!row) return;
      row.innerHTML = kpi.map((k: any) => {
        const max = Math.max(...k.spark);
        const pts = k.spark.map((v: any,i: number) => `${i * (100/(k.spark.length-1))},${max === 0 ? 90 : 100 - (v/max)*90}`).join(' ');
        return `<div class="kpi-card">
          <div class="kpi-card-label">${k.label}</div>
          <div class="kpi-card-value">${k.value}</div>
          <div class="kpi-card-footer">
            <span class="kpi-card-change ${k.up?'up':'dn'}">${k.change}</span>
            <div class="sparkline"><svg viewBox="0 0 100 100" width="100" height="28">
              <polyline fill="none" stroke="${k.up?'var(--positive)':'var(--negative)'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/>
            </svg></div>
          </div>
        </div>`;
      }).join('');
    }

    // ─── Stacked Line Chart ─────────────────────────────────────
    function stackedChart(id: string, series: any, labels: any) {
      const svg = document.getElementById(id);
      if (!svg) return;
      svg.innerHTML = ''; // Clear before re-render
      
      const W = 700, H = 220, P = { t:18, r:16, b:22, l:48 };
      const iw = W - P.l - P.r, ih = H - P.t - P.b;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

      const n = series[0]?.data.length || 12;
      const stacks: number[][] = [];
      for (let i = 0; i < n; i++) {
        let sum = 0;
        stacks[i] = series.map((s: any) => { sum += s.data[i] || 0; return sum; });
      }
      const maxVal = stacks.length > 0 ? Math.max(...stacks.map(s => s[s.length-1] || 0)) : 100;
      const pad = maxVal * 0.08;
      const yMax = maxVal === 0 ? 100 : maxVal + pad;

      const x = (d: number) => P.l + (d / (Math.max(1, n-1))) * iw;
      const y = (d: number) => P.t + ih - (d / yMax) * ih;

      for (let si = series.length-1; si >= 0; si--) {
        const prevStack = si > 0 ? stacks.map(s => s[si-1]) : null;
        const pts = series[si].data.map((_: any,i: number) => `${x(i)},${y(stacks[i][si])}`).join(' ');
        const pts0 = series[si].data.map((_: any,i: number) => {
          const base = prevStack ? prevStack[i] : 0;
          return `${x(i)},${y(base)}`;
        }).reverse().join(' ');
        const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        poly.setAttribute('points', pts + ' ' + pts0);
        poly.setAttribute('fill', series[si].color);
        poly.setAttribute('opacity','0.85');
        svg.appendChild(poly);
      }

      const yTicks = [0, yMax*0.25, yMax*0.5, yMax*0.75, yMax];
      for (const t of yTicks) {
        const yy = y(t);
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', String(P.l)); line.setAttribute('y1', String(yy));
        line.setAttribute('x2', String(P.l+iw)); line.setAttribute('y2', String(yy));
        line.setAttribute('stroke','var(--border)'); line.setAttribute('stroke-width','1');
        svg.appendChild(line);
        const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
        txt.setAttribute('x', String(P.l-6)); txt.setAttribute('y', String(yy+3));
        txt.setAttribute('text-anchor','end'); txt.setAttribute('fill','var(--muted)');
        txt.setAttribute('font-family','var(--font-mono)'); txt.setAttribute('font-size','9');
        txt.setAttribute('font-variant-numeric','tabular-nums');
        txt.textContent = t >= 1000 ? `$${(t/1000).toFixed(1)}k` : `$${Math.round(t/10)*10}`;
        svg.appendChild(txt);
      }

      const step = Math.max(1, Math.floor(n/8));
      for (let i = 0; i < n; i += step) {
        const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
        txt.setAttribute('x', String(x(i))); txt.setAttribute('y', String(H - 4));
        txt.setAttribute('text-anchor','middle'); txt.setAttribute('fill','var(--muted)');
        txt.setAttribute('font-family','var(--font-mono)'); txt.setAttribute('font-size','8');
        txt.textContent = labels ? labels[i] : (cohortLabels[i] || `Mês ${i+1}`);
        svg.appendChild(txt);
      }
    }

    // ─── Heatmap ──────────────────────────────────────────────────
    function renderHeatmap() {
      const container = document.getElementById('heatmap');
      if (!container) return;
      container.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'map-grid';
      for (let i = 0; i < 24*8; i++) {
        const cell = document.createElement('div');
        cell.className = 'map-cell';
        const val = Math.random();
        cell.style.background = `color-mix(in srgb, var(--accent-2) ${Math.floor(val * 80)}%, transparent)`;
        grid.appendChild(cell);
      }
      container.appendChild(grid);
    }

    // ─── Cohort ──────────────────────────────────────────────────
    function renderCohort() {
      const table = document.getElementById('cohort-table');
      if (!table) return;
      let html = '<tr><th>Cohort</th>';
      for (const l of cohortLabels) html += `<th>${l}</th>`;
      html += '</tr>';

      for (const row of cohortData) {
        html += `<tr><td style="font-size:.7rem">${row.cohort}</td>`;
        for (const v of row.row) {
          if (v === null) { html += '<td>—</td>'; continue; }
          const val = v / 100;
          html += `<td style="background:color-mix(in srgb, var(--positive) ${Math.floor(val*100)}%, transparent);color:${val > 0.45 ? '#fff' : 'var(--fg-2)'}">${v}%</td>`;
        }
        html += '</tr>';
      }
      table.innerHTML = html;
    }

    // ─── Ranking ─────────────────────────────────────────────────
    function renderRanking() {
      const table = document.getElementById('ranking-table');
      if (!table) return;
      let html = '<tr><th>Customer</th><th>MRR</th><th>Change</th><th>Status</th></tr>';
      for (const c of customers) {
        html += `<tr>
          <td>${c.name}</td>
          <td>${c.mrr}</td>
          <td class="change-cell" style="color:${c.up?'var(--positive)':'var(--negative)'}">${c.change}</td>
          <td><span class="status-pill ${c.status}">${c.status}</span></td>
        </tr>`;
      }
      table.innerHTML = html;
    }

    // ─── Event Feed ───────────────────────────────────────────────
    function addEvent() {
      const feed = document.getElementById('event-feed');
      if (!feed) return;
      const EVENT_TYPES = ['plan','user','billing','system','api'];
      const EVENT_NAMES: Record<string, string> = { plan: 'New workspace created', user: 'User invited to team', billing: 'Invoice paid', system: 'Integration synced', api: 'API request logged' };
      const EVENT_SUBJECTS = ['DevTeam','Acme/Prod','Stark/staging','Hooli/ml','Globex/main','Umbrella/eu','Initech/dev'];
      
      const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      const subj = EVENT_SUBJECTS[Math.floor(Math.random() * EVENT_SUBJECTS.length)];
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

      const item = document.createElement('div');
      item.className = 'event-item';
      item.innerHTML = `<span class="event-dot ${type}"></span><span class="event-time">${time}</span><span class="event-text"><strong>${subj}</strong> — ${EVENT_NAMES[type]}</span>`;
      feed.appendChild(item);

      while (feed.children.length > 60) {
        if(feed.firstChild) feed.removeChild(feed.firstChild);
      }
      feed.scrollTop = feed.scrollHeight;
    }

    // Initialize
    renderKPI();
    stackedChart('chart-mrr', mrrSeries, null);
    stackedChart('chart-timeline', timelineSeries, timelineLabels);
    renderHeatmap();
    renderCohort();
    renderRanking();

    // seed initial events
    for (let i = 0; i < 12; i++) addEvent();
    
    // live events every 3-6s
    const intervalId = setInterval(addEvent, 3000 + Math.random() * 3000);
    return () => clearInterval(intervalId); // cleanup
  }, [kpi, mrrSeries, timelineSeries, timelineLabels, cohortLabels, cohortData, customers]);

  return (
    <main className="dashboard">
      {/* KPI Row */}
      <section className="kpi-row" id="kpi-row"></section>

      {/* Charts */}
      <section className="charts-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Monthly Recurring Revenue</h2>
            <span className="meta">Últimas semanas</span>
          </div>
          <div className="panel-body"><svg className="chart-svg" id="chart-mrr"></svg></div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Executions Timeline</h2>
            <span className="meta">Últimos 30 dias</span>
          </div>
          <div className="panel-body"><svg className="chart-svg" id="chart-timeline"></svg></div>
        </div>
      </section>

      {/* Map + Cohort */}
      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Global Usage Heatmap</h2>
            <span className="meta">Requisições / segundo</span>
          </div>
          <div className="panel-body map-container" id="heatmap"></div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Retention by Cohort</h2>
            <span className="meta">% ativos após N semanas</span>
          </div>
          <div className="panel-body" style={{ overflowX: "auto" }}>
            <table className="cohort-table" id="cohort-table"></table>
          </div>
        </div>
      </section>

      {/* Ranking + Events */}
      <section className="split-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Top Customers by MRR</h2>
            <span className="meta">Este mês</span>
          </div>
          <div className="panel-body" style={{ padding: "0 .5rem .5rem" }}>
            <table className="ranking-table" id="ranking-table"></table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Live Events</h2>
            <span className="meta">Tempo real</span>
          </div>
          <div className="panel-body">
            <div className="event-feed" id="event-feed"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
