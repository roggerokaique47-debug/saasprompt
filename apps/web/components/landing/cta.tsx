'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Cta() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cta_footer' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao cadastrar.');
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 text-center text-white md:p-16 shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_50%)] opacity-10" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl tracking-tight">
              Acesso Antecipado NovaFlow
            </h2>
            <p className="mx-auto mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Inscreva-se na nossa lista VIP para ser um dos **primeiros 100 usuários** a ganhar 1.000 créditos gratuitos no lançamento.
            </p>
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center space-y-3 bg-white/10 p-6 rounded-2xl border border-white/20">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
                <h3 className="text-xl font-bold">Lugar garantido!</h3>
                <p className="text-white/80">Você está na nossa lista VIP. Avisaremos em breve!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail profissional..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 rounded-xl px-6 focus-visible:ring-white outline-none ring-1 ring-transparent focus:ring-white/50 transition-all w-full sm:w-auto"
                  disabled={status === 'loading'}
                />
                <Button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="h-14 px-8 rounded-xl bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-lg whitespace-nowrap transition-all"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Entrando...</>
                  ) : (
                    'Garantir Vaga'
                  )}
                </Button>
              </form>
            )}

            {status === 'error' && (
              <p className="text-red-300 mt-4 text-sm font-medium">{errorMessage}</p>
            )}
            
            <p className="text-sm text-white/50 mt-6 flex items-center justify-center gap-2">
              🔒 Sem spam. Cancele quando quiser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
