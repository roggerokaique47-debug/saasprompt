'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WorkflowAICreator() {
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
    "Monitore menções da minha marca no Twitter e crie uma tarefa no Notion para a equipe de marketing.",
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    // Simulação de geração por IA
    setTimeout(() => {
      setGeneratedWorkflow({
        name: "Automação de Leads & CRM",
        steps: [
          "Gatilho: Novo Lead no Facebook Ads",
          "Ação: Salvar dados no Google Sheets",
          "Condição: Se valor > R$ 1000",
          "Ação: Enviar Email Personalizado (Gmail)",
          "Ação: Criar Card no Trello",
          "Ação: Notificar Equipe no Slack"
        ],
        integrations: ["Facebook Ads", "Google Sheets", "Gmail", "Trello", "Slack"]
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header da Seção */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
          <Sparkles className="w-3 h-3 mr-1" />
          IA Generativa
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Descreva seu fluxo, a IA constrói.
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Não precisa arrastar nós manualmente. Apenas diga o que você quer automatizar em linguagem natural e nossa IA monta o workflow completo em segundos.
        </p>
      </div>

      {/* Área de Input */}
      <Card className="border-2 border-purple-200 shadow-lg overflow-hidden bg-gradient-to-br from-white to-purple-50/50">
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-6 h-6 text-purple-500" />
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Quando chegar um pedido na Shopify, envie mensagem no WhatsApp, gere a nota e atualize a planilha..."
              className="w-full pl-12 pr-4 py-4 min-h-[120px] rounded-xl border-0 bg-white/80 focus:ring-2 focus:ring-purple-500 resize-none text-lg shadow-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap py-2">Exemplos:</span>
              {examples.slice(0, 2).map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-xs bg-white border rounded-full px-3 py-1.5 hover:bg-purple-50 hover:border-purple-300 transition-colors whitespace-nowrap text-left max-w-[200px] truncate"
                >
                  {ex.slice(0, 40)}...
                </button>
              ))}
            </div>
            <Button 
              size="lg" 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 shadow-md w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando Mágica...
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

      {/* Resultado Gerado */}
      {generatedWorkflow && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-900">Workflow Pronto: {generatedWorkflow.name}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Lista de Passos */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Fluxo Gerado</h4>
                  <div className="space-y-2">
                    {generatedWorkflow.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-100 shadow-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrações Detectadas */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Integrações Necessárias</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedWorkflow.integrations.map((app) => (
                      <Badge key={app} variant="outline" className="bg-white text-gray-700 border-gray-200 px-3 py-1.5 text-sm">
                        <Zap className="w-3 h-3 mr-1.5 text-yellow-500" />
                        {app}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-white rounded-xl border border-green-100 text-center space-y-3">
                    <p className="text-sm text-gray-600">Seu workflow está pronto para ser ativado.</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Ativar Automação Agora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-gray-500">
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
