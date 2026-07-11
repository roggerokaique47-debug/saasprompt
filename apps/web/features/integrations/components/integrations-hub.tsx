'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Key, CheckCircle2, ShieldAlert, Mail, MessageSquare, Users } from 'lucide-react';
import { WahaConnector } from '@/features/whatsapp/components/waha-connector';

interface Integration {
  id: string;
  provider: string;
  accessToken: string | null;
}

export function IntegrationsHub({ userId }: { userId: string }) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAiKey, setOpenAiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch (error) {
      console.error('Failed to fetch integrations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSaveOpenAI = async () => {
    setFeedback(null);
    if (!openAiKey.trim().startsWith('sk-')) {
      setFeedback({ type: 'error', text: 'A chave da OpenAI deve começar com sk-' });
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'openai',
          accessToken: openAiKey,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Chave salva com sucesso!' });
        setOpenAiKey('');
        await fetchIntegrations();
      } else {
        setFeedback({ type: 'error', text: 'Erro ao salvar a chave.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  const getOpenAIIntegration = () => integrations.find(i => i.provider === 'openai');
  const getGoogleIntegration = () => integrations.find(i => i.provider === 'google');
  const getSlackIntegration = () => integrations.find(i => i.provider === 'slack');
  const getHubspotIntegration = () => integrations.find(i => i.provider === 'hubspot');

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">OpenAI (BYOK)</h3>
              <p className="text-sm text-muted-foreground">Traga sua própria chave de API</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Conecte sua própria chave da OpenAI para utilizar os agentes de IA sem consumir os tokens da sua assinatura atual.
            </p>
            
            {getOpenAIIntegration() ? (
              <div className="rounded-lg border bg-green-50/50 p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Chave conectada</span>
                </div>
                <p className="mt-1 text-xs text-green-600/80">
                  Token: {getOpenAIIntegration()?.accessToken}
                </p>
              </div>
            ) : null}

            <div className="space-y-3 pt-2">
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="sk-proj-..."
                value={openAiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpenAiKey(e.target.value)}
              />
              
              {feedback && (
                <div className={`text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {feedback.text}
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldAlert className="h-3 w-3" />
                  Criptografado ponta a ponta (AES-256)
                </p>
                <Button 
                  onClick={handleSaveOpenAI} 
                  disabled={saving || !openAiKey}
                  size="sm"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Chave
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Google Workspace */}
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">Google Workspace</h3>
              <p className="text-sm text-muted-foreground">Gmail, Sheets, Drive</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Conecte sua conta do Google para permitir que a IA envie e-mails, leia mensagens, e edite planilhas em seu nome.
            </p>
            
            {getGoogleIntegration() ? (
              <div className="rounded-lg border bg-green-50/50 p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Conta conectada (OAuth)</span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/api/oauth/google'} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Reconectar Conta
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <Button 
                  onClick={() => window.location.href = '/api/oauth/google'} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Conectar com Google
                </Button>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-3">
                  <ShieldAlert className="h-3 w-3" />
                  Padrão OAuth 2.0. Acesso revogável.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Slack Integration */}
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A154B] text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">Slack</h3>
              <p className="text-sm text-muted-foreground">Bot e Mensagens</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Conecte sua conta do Slack para enviar notificações, logs e alertas diretos em canais pelo seu bot.
            </p>
            
            {getSlackIntegration() ? (
              <div className="rounded-lg border bg-green-50/50 p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Workspace conectado</span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/api/oauth/slack'} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Reconectar Conta
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <Button 
                  onClick={() => window.location.href = '/api/oauth/slack'} 
                  className="w-full bg-[#4A154B] hover:bg-[#3B0E3C] text-white"
                >
                  Conectar com Slack
                </Button>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-3">
                  <ShieldAlert className="h-3 w-3" />
                  Padrão OAuth 2.0. Acesso revogável.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* HubSpot Integration */}
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF7A59] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">HubSpot</h3>
              <p className="text-sm text-muted-foreground">CRM e Contatos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Conecte sua conta HubSpot para criar e gerenciar contatos, leads e negócios através da automação.
            </p>
            
            {getHubspotIntegration() ? (
              <div className="rounded-lg border bg-green-50/50 p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Portal conectado</span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/api/oauth/hubspot'} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Reconectar Conta
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <Button 
                  onClick={() => window.location.href = '/api/oauth/hubspot'} 
                  className="w-full bg-[#FF7A59] hover:bg-[#E06A4D] text-white"
                >
                  Conectar com HubSpot
                </Button>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-3">
                  <ShieldAlert className="h-3 w-3" />
                  Padrão OAuth 2.0. Acesso revogável.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Nativo (WAHA) */}
      <WahaConnector userId={userId} />
    </div>
  );
}
