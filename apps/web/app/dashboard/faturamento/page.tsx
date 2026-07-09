import React from 'react';
import { CreditCard, Key } from 'lucide-react';

export const metadata = {
  title: 'Faturamento - Brasa Match',
};

export default function FaturamentoPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-indigo-500" />
            Central de Faturamento
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Acompanhe seu saldo de tokens, recarregue e gerencie chaves do plano Enterprise (BYOK).
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
          <h3 className="text-xl font-semibold mb-2">Saldo de Tokens</h3>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">100</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Tokens são usados para gerar fluxos de IA, usar o Copilot e enviar mensagens via WAHA.
          </p>
          
          <form action="/api/stripe/checkout" method="POST">
            <input type="hidden" name="priceId" value="price_12345" />
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Comprar +500 Tokens
            </button>
          </form>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-zinc-500" />
            <h3 className="text-xl font-semibold">Chave Própria (BYOK)</h3>
          </div>
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-4 font-medium dark:bg-yellow-900/30 dark:text-yellow-500">
            Apenas Enterprise
          </span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Insira sua própria chave da OpenAI ou OpenRouter para utilizar o Copilot e Geração sem gastar seus Tokens da plataforma.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chave de API</label>
              <input 
                type="password" 
                placeholder="sk-..." 
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button 
              className="w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Salvar Chave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
