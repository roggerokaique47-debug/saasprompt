'use client';

import { useState } from 'react';
import { Zap, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface InstallButtonProps {
  workflowId: string;
  isPremium?: boolean;
}

export function MarketplaceInstallButton({ workflowId, isPremium }: InstallButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInstall = async () => {
    setState('loading');
    try {
      const res = await fetch(`/api/marketplace/install/${workflowId}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao instalar.');
      }

      setState('success');
      setMessage('Instalado com sucesso!');
    } catch (err: any) {
      setState('error');
      setMessage(err.message || 'Erro inesperado.');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  if (state === 'success') {
    return (
      <button
        disabled
        className="w-full px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-medium flex items-center justify-center gap-2 cursor-default"
      >
        <CheckCircle2 className="w-4 h-4" />
        Instalado!
      </button>
    );
  }

  if (state === 'error') {
    return (
      <button
        disabled
        className="w-full px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center justify-center gap-2 cursor-default"
      >
        <AlertCircle className="w-3.5 h-3.5" />
        {message}
      </button>
    );
  }

  return (
    <button
      onClick={handleInstall}
      disabled={state === 'loading'}
      className="w-full px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[#5b4cdb] disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
    >
      {state === 'loading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Zap className="w-3.5 h-3.5" />
      )}
      {state === 'loading' ? 'Instalando...' : isPremium ? 'Adquirir e Instalar' : 'Instalar Grátis'}
    </button>
  );
}
