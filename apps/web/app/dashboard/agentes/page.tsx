import React from 'react';
import { WahaManager } from '@/components/waha-manager';
import { Bot } from 'lucide-react';

export const metadata = {
  title: 'Agentes de IA - WhatsApp',
};

export default function AgentesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <Bot className="w-8 h-8 text-indigo-500" />
            Central de Agentes
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Gerencie as conexões de WhatsApp e conecte-as aos modelos de Inteligência Artificial para atendimento automatizado.
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <WahaManager />
      </div>
    </div>
  );
}
