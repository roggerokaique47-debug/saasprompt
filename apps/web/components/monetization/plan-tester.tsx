"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PlanTester() {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'premium'>('free');
  const router = useRouter();

  // Apenas para renderizar no client-side de forma segura (evita hidration mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Tenta ler o cookie de simulação se existir
    const isPremium = document.cookie.includes('simulated_plan=premium');
    setCurrentPlan(isPremium ? 'premium' : 'free');
    setMounted(true);
  }, []);

  const togglePlan = () => {
    const newPlan = currentPlan === 'free' ? 'premium' : 'free';
    document.cookie = `simulated_plan=${newPlan}; path=/`;
    setCurrentPlan(newPlan);
    router.refresh(); // Força o refresh da página para o Server Component pegar o novo cookie
  };

  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <button
        onClick={togglePlan}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all ${
          currentPlan === 'premium'
            ? 'bg-indigo-500/90 hover:bg-indigo-600 text-white border-indigo-500/50'
            : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
        }`}
      >
        {currentPlan === 'premium' ? (
          <>
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-bold tracking-wide">Modo: PREMIUM (Clean)</span>
          </>
        ) : (
          <>
            <Megaphone className="w-4 h-4 text-red-400" />
            <span className="text-sm font-bold tracking-wide">Modo: FREE (Com Ads)</span>
          </>
        )}
      </button>
    </div>
  );
}
