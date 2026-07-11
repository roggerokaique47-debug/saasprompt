'use client';

import { useState } from 'react';

export function VslSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="section relative z-10" id="video-demo">
        <div className="container grid gap-14 md:grid-cols-2 md:items-center">
          
          <div className="animate-fade-in-up">
            <p className="eyebrow">VEJA NA PRÁTICA</p>
            <h2 className="h2 mb-4">Veja como a NovaFlow transforma automação em minutos.</h2>
            <p className="lead mb-6">Uma demonstração rápida mostrando como criar um agente de IA para WhatsApp, conectar suas ferramentas e publicar em segundos.</p>
            
            <ul className="flex flex-col gap-3 mt-6">
              <li className="flex items-center gap-3 text-[14px] text-[var(--fg-secondary)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[11px] font-bold text-[var(--accent)]">✓</span>
                Criação de fluxo visual em menos de 2 minutos
              </li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--fg-secondary)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[11px] font-bold text-[var(--accent)]">✓</span>
                Conexão com WhatsApp, CRM e e-mail ao vivo
              </li>
              <li className="flex items-center gap-3 text-[14px] text-[var(--fg-secondary)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[11px] font-bold text-[var(--accent)]">✓</span>
                Painel de acompanhamento com métricas reais
              </li>
            </ul>
          </div>
          
          <div className="animate-fade-in-up order-first md:order-last">
            <div 
              className="relative mx-auto w-full max-w-[520px] aspect-[16/10.8] cursor-pointer overflow-hidden rounded-[14px] border-2 border-[var(--border)] bg-[#121214] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5),0_0_0_1px_var(--border)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_24px_72px_-12px_rgba(108,92,231,0.2),0_0_0_1px_var(--accent-soft)]"
              onClick={() => setIsVideoOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsVideoOpen(true);
                }
              }}
            >
              <div className="absolute left-1/2 top-0 z-10 h-[5px] w-[120px] -translate-x-1/2 rounded-b-[4px] bg-[var(--border)]"></div>
              
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,var(--accent-soft),transparent_60%),radial-gradient(ellipse_at_70%_60%,color-mix(in_oklch,var(--accent)_6%,transparent),transparent_50%)]"></div>
                
                <button className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-none bg-[var(--accent)] text-[var(--surface)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_8px_var(--accent-glow)] group">
                  <div className="absolute inset-0 rounded-full shadow-[0_0_0_0_var(--accent-glow)] animate-pulse-glow group-hover:animate-none group-hover:shadow-none"></div>
                  <svg className="ml-1 h-7 w-7 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              
              <span className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] opacity-50">
                Assista em 2 min
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Video Modal */}
      <div 
        className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isVideoOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsVideoOpen(false)}
        role="dialog"
        aria-modal="true"
      >
        <div 
          className={`relative flex aspect-video w-[min(90vw,960px)] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] transition-transform duration-300 ${isVideoOpen ? 'scale-100' : 'scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-lg text-[var(--fg)] transition-colors hover:bg-[var(--surface-alt)]"
            onClick={() => setIsVideoOpen(false)}
            aria-label="Fechar"
          >
            ✕
          </button>
          <div className="p-10 text-center font-mono text-[14px] text-[var(--muted)]">
            <strong className="mb-2 block font-sans text-lg text-[var(--fg)]">🎬 Vídeo demonstrativo</strong>
            <p>Insira aqui o link do seu vídeo de demonstração (YouTube, Vimeo ou MP4).</p>
            <small className="mt-4 block text-[12px] opacity-60">Por enquanto é um placeholder — substitua pelo embed real.</small>
          </div>
        </div>
      </div>
    </>
  );
}
