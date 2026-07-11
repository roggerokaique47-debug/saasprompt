import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative z-10 overflow-hidden py-24 md:py-32" id="hero">
      <div className="container relative z-10 grid gap-14 md:grid-cols-2 md:items-center">
        
        {/* Text Content */}
        <div className="animate-fade-in-up">
          <h1 className="h1 mb-5">
            Crie fluxos de IA sem digitar uma linha de código.
          </h1>
          <p className="lead mb-8">
            Conecte WhatsApp, e-mail, CRM e bancos de dados em minutos. A NovaFlow AI automatiza tarefas repetitivas com agentes inteligentes — tudo em um construtor visual de arrastar e soltar.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="#vip-form" className="btn btn-primary btn-glow group">
              Garantir Acesso Antecipado
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#como-funciona" className="btn btn-secondary group">
              Ver como funciona
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="text-[13px] text-[var(--muted)] flex items-center flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1">✓ Criação em 5 minutos</span>
            <span className="text-[var(--border)]">·</span>
            <span className="inline-flex items-center gap-1">✓ Sem cartão de crédito</span>
            <span className="text-[var(--border)]">·</span>
            <span className="inline-flex items-center gap-1">✓ Templates prontos</span>
          </div>
          
          <div className="animate-fade-in-up mt-5 flex items-center gap-2.5 text-[14px] text-[var(--accent)] p-2.5 px-4 rounded-lg bg-[var(--accent-soft)] border border-[color-mix(in_oklch,var(--accent)_25%,transparent)]">
            <span className="text-[20px]">🎯</span>
            <div>
              <strong className="text-[var(--fg)]">1.000 créditos gratuitos</strong> — apenas para os 100 primeiros cadastros
            </div>
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="animate-fade-in-up relative mx-auto w-full max-w-[500px] aspect-video md:aspect-square flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 rounded-2xl bg-[var(--accent-soft)] blur-3xl opacity-50"></div>
          <div className="relative w-full h-[300px] md:h-full max-h-[400px] rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--surface)_60%,transparent)] backdrop-blur-xl shadow-2xl flex items-center justify-center animate-float">
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[var(--accent)] via-transparent to-[var(--accent)] opacity-20 pointer-events-none"></div>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="opacity-30 text-[var(--fg)]">
              <rect x="2" y="2" width="56" height="56" rx="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M18 20h24M18 30h16M18 40h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="46" cy="20" r="3" fill="var(--accent)" opacity="0.6"/>
              <circle cx="46" cy="40" r="3" fill="var(--accent)" opacity="0.6"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
