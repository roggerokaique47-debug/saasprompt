import React from 'react';
import { Sparkles, XCircle } from 'lucide-react';
import Link from 'next/link';

export function AdBanner() {
  return (
    <div className="w-full relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 my-4 flex items-center justify-between shadow-[0_0_15px_rgba(0,0,0,0.1)] group transition-all hover:bg-white/10">
      
      {/* Indicador sutil de Ads */}
      <div className="absolute top-0 right-0 bg-zinc-800/80 text-[10px] text-zinc-400 px-2 py-0.5 rounded-bl-lg font-medium tracking-wider">
        ADVERTISEMENT
      </div>

      <div className="flex items-center space-x-4 z-10">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-100">Cansado de ver anúncios?</h3>
          <p className="text-xs text-zinc-400 max-w-md">
            Faça o upgrade para o plano Premium e libere a interface 100% limpa, super rápida e focada exclusivamente no seu negócio.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 z-10">
        <Link 
          href="/planos"
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
        >
          Remover Anúncios
        </Link>
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Fechar (Apenas Premium)">
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Brilho animado de fundo (Glassmorphism) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]" />
    </div>
  );
}
