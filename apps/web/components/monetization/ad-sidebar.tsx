import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';

export function AdSidebar() {
  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Container Principal do Ad Sidebar */}
      <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden relative group flex flex-col">
        
        <div className="absolute top-0 right-0 bg-zinc-800/80 text-[10px] text-zinc-400 px-2 py-0.5 rounded-bl-lg font-medium tracking-wider z-20">
          SPONSORED
        </div>

        {/* Espaço do "Vídeo" ou Imagem do Anúncio (Fallback bonito) */}
        <div className="h-48 w-full bg-zinc-900/50 relative overflow-hidden flex items-center justify-center border-b border-white/5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity group-hover:opacity-50 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          
          <div className="z-10 text-center p-4">
            <h4 className="text-xl font-bold text-white mb-1">NovaFlow Masterclass</h4>
            <p className="text-xs text-zinc-300 font-medium">Aprenda a escalar sua agência</p>
          </div>
        </div>

        {/* Corpo do Anúncio */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1 mb-2 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Descubra como mais de 10.000 profissionais estão usando automação para reduzir a jornada de trabalho pela metade.
            </p>
          </div>
          
          <div className="mt-4">
            <button className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all border border-white/5">
              <span>Saiba mais</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mini CTA para Remover Ads */}
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center backdrop-blur-sm">
        <p className="text-xs text-indigo-300 font-medium mb-2">Apoie o projeto e navegue sem distrações.</p>
        <Link href="/planos" className="text-sm text-indigo-400 hover:text-indigo-300 font-bold underline decoration-indigo-500/30 underline-offset-4">
          Fazer Upgrade Pro
        </Link>
      </div>
    </div>
  );
}
