'use client';

import React from 'react';
import { Calculator } from 'lucide-react';
import { Node } from '@xyflow/react';

interface CostEstimatorProps {
  nodes: Node[];
}

export function CostEstimator({ nodes }: CostEstimatorProps) {
  // Cálculo básico: 
  // Cada nó do tipo "openai" custa X tokens.
  // Modelos mais caros custam mais tokens.
  let estimatedTokens = 0;
  
  nodes.forEach((node) => {
    if (node.data?.type === 'openai') {
      const model = (node.data?.config as any)?.model;
      if (model === 'gpt-4o') {
        estimatedTokens += 5; // Custo alto
      } else if (model === 'claude-3-5-sonnet') {
        estimatedTokens += 3; // Custo médio
      } else {
        estimatedTokens += 1; // Padrão / gpt-4o-mini
      }
    } else if (node.data?.type === 'waha' || node.data?.type === 'webhook' || node.data?.type === 'http_request') {
      estimatedTokens += 1;
    }
  });

  if (estimatedTokens === 0) return null;

  return (
    <div className="absolute bottom-6 left-6 z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-4 flex items-center gap-4 transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
        <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
          Estimativa de Custo
        </p>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          <span className="text-indigo-600 dark:text-indigo-400 text-lg">{estimatedTokens}</span> Tokens / Execução
        </p>
      </div>
    </div>
  );
}
