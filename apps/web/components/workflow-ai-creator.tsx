'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function WorkflowAICreator() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<null | {
    name: string;
    steps: string[];
    integrations: string[];
  }>(null);

  const examples = [
    "Quando chegar um lead no Facebook, salve no Google Sheets e envie um email de boas-vindas.",
    "Sempre que receber um pagamento no Stripe, envie um recibo no WhatsApp e atualize o CRM.",
    "Monitore mencoes da minha marca no Twitter e crie uma tarefa no Notion para a equipe de marketing.",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // Extract unique integration names from the generated nodes
      const integrations = Array.from(new Set(data.nodes.map((n: any) => n.data?.type || 'webhook'))) as string[];
      const steps = data.nodes.map((n: any, idx: number) => `Passo ${idx + 1}: ${n.data?.label || n.data?.type}`);

      setGeneratedWorkflow({
        name: "Workflow Gerado por IA",
        steps,
        integrations
      });
      
      // Salvar no localStorage temporariamente caso o usuário clique em Editar
      if (typeof window !== 'undefined') {
        localStorage.setItem('ai_generated_workflow', JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar workflow pela IA. Verifique as configurações de API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="space-y-4 text-center">
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
          <Sparkles className="mr-1 h-3 w-3" />
          IA Generativa
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Descreva seu fluxo, a IA constroi.
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Nao precisa arrastar nos manualmente. Apenas diga o que voce quer automatizar
          em linguagem natural e nossa IA monta o workflow completo em segundos.
        </p>
      </div>

      <Card className="overflow-hidden border-2 border-purple-200 shadow-lg bg-gradient-to-br from-white to-purple-50/50">
        <CardContent className="space-y-4 p-6">
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 h-6 w-6 text-purple-500" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Quando chegar um pedido na Shopify, envie mensagem no WhatsApp, gere a nota e atualize a planilha..."
              className="min-h-[120px] w-full resize-none rounded-xl border-0 bg-white/80 py-4 pl-12 pr-4 text-lg shadow-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex w-full gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
              <span className="whitespace-nowrap py-2 text-sm text-muted-foreground">Exemplos:</span>
              {examples.slice(0, 2).map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="max-w-[200px] truncate whitespace-nowrap rounded-full border bg-white px-3 py-1.5 text-xs text-left hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-purple-600 px-8 text-white shadow-md hover:bg-purple-700 sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando Magica...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar Workflow
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedWorkflow && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">Workflow Pronto: {generatedWorkflow.name}</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Fluxo Gerado
                  </h4>
                  <div className="space-y-2">
                    {generatedWorkflow.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg border border-green-100 bg-white p-3 shadow-sm">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Integracoes Necessarias
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedWorkflow.integrations.map((app) => (
                      <Badge key={app} variant="outline" className="border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
                        <Zap className="mr-1.5 h-3 w-3 text-yellow-500" />
                        {app}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3 rounded-xl border border-green-100 bg-white p-4 text-center">
                    <p className="text-sm text-gray-600">
                      Seu workflow esta pronto para ser ativado.
                    </p>
                    <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                      Ativar Automacao Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-gray-500" onClick={() => router.push('/dashboard/workflows/novo/edit')}>
                      Editar no Editor Visual
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
