'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Sparkles, X, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Node, Edge } from '@xyflow/react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (nodes: Node[], edges: Edge[]) => void;
}

export function AIGeneratorModal({ isOpen, onOpenChange, onGenerate }: AIGeneratorModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido ao gerar workflow.');
      }

      if (data.nodes && Array.isArray(data.nodes)) {
        onGenerate(data.nodes, data.edges || []);
        setPrompt('');
        onOpenChange(false);
      } else {
        throw new Error('A resposta da IA não contém nós válidos.');
      }
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setError(err.message || 'Falha ao gerar workflow. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2 text-slate-800">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                NovaFlow IA Builder
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-full p-2 hover:bg-slate-100 transition-colors opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="text-sm text-slate-500 pt-2">
              Descreva o que você deseja automatizar. A nossa IA criará a estrutura completa do workflow para você instantaneamente.
            </Dialog.Description>
          </div>
          
          <div className="py-4">
            <textarea
              className="flex w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent min-h-[120px] resize-none transition-all shadow-inner"
              placeholder="Ex: Receber um webhook do Stripe, verificar se o valor é maior que 100 reais, e enviar uma mensagem de sucesso no Slack."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-2 rounded-md border border-red-100">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isLoading} className="text-slate-600">
                Cancelar
              </Button>
            </Dialog.Close>
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando a mágica...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Gerar Automagicamente
                </>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
