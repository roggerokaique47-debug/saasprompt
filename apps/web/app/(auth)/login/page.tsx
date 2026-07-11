import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entrar',
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen bg-slate-50 selection:bg-primary/20">
      <div className="relative flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-12 xl:px-24 text-slate-900">
        {/* Decorative background element on left side */}
        <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="w-full max-w-sm mx-auto">
          <Link href="/" className="mb-10 flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#00CEC9] text-lg font-bold text-white shadow-md shadow-primary/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight">NovaFlow AI</span>
          </Link>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Bem-vindo de volta</h1>
          <p className="mb-8 text-base text-slate-500">
            Acesse sua conta para continuar automatizando.
          </p>
          
          <LoginForm />
          
          <p className="mt-8 text-center text-sm text-slate-500">
            Não tem conta?{' '}
            <Link href="/cadastro" className="font-semibold text-primary transition-all hover:text-primary/80 hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-[#0A0A0B] lg:flex">
        {/* Animated gradients */}
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] animate-pulse-glow rounded-full bg-[#6C5CE7]/30 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-[#00CEC9]/20 blur-[120px] mix-blend-screen" style={{ animation: 'pulse-glow 4s ease-in-out infinite alternate-reverse' }} />
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 max-w-md animate-fade-in-up rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#00CEC9] text-3xl text-white shadow-lg shadow-primary/30 ring-1 ring-white/20">
            ⚡
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">
            Automação com IA<br/>ao seu alcance
          </h2>
          <p className="text-lg leading-relaxed text-white/70">
            Crie workflows inteligentes, instale automações prontas e contrate
            Funcionários de IA para transformar seus processos num piscar de olhos.
          </p>
          
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-[#1A1A1D] bg-gradient-to-br from-slate-700 to-slate-800" />
              ))}
            </div>
            <div className="text-sm font-medium text-white/60">
              Junte-se a <span className="text-white">milhares</span> de empresas
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
