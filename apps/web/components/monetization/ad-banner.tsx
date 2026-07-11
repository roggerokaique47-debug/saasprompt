"use client";

import React from 'react';
import { Rocket, Zap } from 'lucide-react';
import Link from 'next/link';

export function AdBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-6 shadow-xl backdrop-blur-md mb-6 group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Desbloqueie o Poder Total
              <span className="text-[10px] uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">Pro</span>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              Você está usando a versão Grátis. Remova as marcas d'água, conecte o WhatsApp ilimitado e crie Agentes de IA avançados.
            </p>
          </div>
        </div>

        <Link 
          href="/dashboard/faturamento"
          className="flex items-center justify-center gap-2 whitespace-nowrap py-2.5 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <Rocket className="w-4 h-4" />
          Fazer Upgrade
        </Link>
      </div>
    </div>
  );
}
