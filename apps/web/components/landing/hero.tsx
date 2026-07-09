import Link from 'next/link';
import { ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0B] pb-24 pt-32 md:pt-40 text-white">
      {/* Animated glowing orbs */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-secondary/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-white">1497+ Agent Skills</span> Disponíveis Agora
          </div>

          <h1 className="animate-fade-in-up mb-6 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl" style={{ animationDelay: '0.1s' }}>
            A Nova Era da
            <br />
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-secondary bg-clip-text text-transparent">
              Automação Inteligente
            </span>
          </h1>

          <p className="animate-fade-in-up mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl" style={{ animationDelay: '0.2s' }}>
            Transforme sua operação com workflows turbinados por IA. Instale habilidades oficiais das maiores empresas do mundo em poucos cliques, sem código.
          </p>

          <div className="animate-fade-in-up mx-auto mb-12 flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/cadastro"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-[0_0_40px_-10px_rgba(108,92,231,0.5)] transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_60px_-15px_rgba(108,92,231,0.7)]"
            >
              Começar Grátis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/workflows"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
            >
              <Play className="h-5 w-5 fill-white/80" />
              Ver Demonstração
            </Link>
          </div>

          <div className="animate-fade-in-up flex flex-wrap justify-center gap-6 text-sm text-slate-400" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Sem cartão de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Editor visual drag & drop
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Ecossistema Open Source
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Deploy instantâneo
            </span>
          </div>
        </div>

        {/* Dashboard Preview / Glassmorphism Mockup */}
        <div className="animate-fade-in-up relative mt-20 mx-auto max-w-5xl animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-30 blur-xl"></div>
          <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0B]/80 p-2 shadow-2xl backdrop-blur-xl">
            <div className="rounded-xl border border-white/5 bg-[#121214] p-4 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-mono text-slate-500">Agent Flow Execution // US-EAST-1</div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 p-2 text-blue-400 mb-4">
                    <Sparkles className="h-full w-full" />
                  </div>
                  <div className="h-4 w-24 rounded bg-white/10 mb-2"></div>
                  <div className="h-3 w-32 rounded bg-white/5"></div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-4 opacity-70">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/20 p-2 text-purple-400 mb-4">
                    <ArrowRight className="h-full w-full" />
                  </div>
                  <div className="h-4 w-20 rounded bg-white/10 mb-2"></div>
                  <div className="h-3 w-28 rounded bg-white/5"></div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-4 opacity-50">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 p-2 text-emerald-400 mb-4">
                    <CheckCircle2 className="h-full w-full" />
                  </div>
                  <div className="h-4 w-16 rounded bg-white/10 mb-2"></div>
                  <div className="h-3 w-24 rounded bg-white/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
