import React from 'react';
import { Settings2, MessageSquare, Mail, Webhook, Smartphone, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata = {
  title: 'Integrações - NovaFlow',
};

export default function IntegrationsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-indigo-500" />
            Integrações e API Keys
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Conecte suas contas do Slack, Discord, Email e gerencie suas credenciais.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* WhatsApp / WAHA */}
        <Card className="relative overflow-hidden border-2 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">Ativo</Badge>
            </div>
            <h3 className="font-semibold text-lg">WhatsApp (WAHA)</h3>
            <p className="text-sm text-zinc-500">Envie mensagens automatizadas via WhatsApp.</p>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/whatsapp" className="w-full">
              <Button variant="outline" className="w-full">
                Gerenciar Aparelho
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Slack */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2.5 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                <MessageSquare className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Slack</h3>
            <p className="text-sm text-zinc-500">Notificações em canais do Slack via Webhook.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="https://hooks.slack.com/..." 
                className="w-full text-sm border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent"
              />
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900">
                Salvar Webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Discord */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Discord</h3>
            <p className="text-sm text-zinc-500">Mande alertas para o seu servidor do Discord.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="URL do Webhook do Discord" 
                className="w-full text-sm border border-zinc-300 dark:border-zinc-700 rounded-md p-2 bg-transparent"
              />
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Salvar Webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SMTP Email */}
        <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
                <Mail className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Email (SMTP Customizado)</h3>
            <p className="text-sm text-zinc-500">Configure seu próprio servidor SMTP para enviar emails.</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configurar SMTP
            </Button>
          </CardContent>
        </Card>

        {/* Custom API Keys */}
        <Card className="md:col-span-2 relative overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all bg-zinc-50 dark:bg-zinc-900/50">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg">Suas API Keys (NovaFlow API)</h3>
            <p className="text-sm text-zinc-500">Gere chaves para disparar seus Webhooks e workflows via código externo.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900">
                <div>
                  <p className="font-medium text-sm">Chave de Produção</p>
                  <p className="text-xs text-zinc-500 font-mono">sk_live_**********************</p>
                </div>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm">Copiar</Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Revogar</Button>
                </div>
              </div>
              <Button className="w-full border-dashed border-2" variant="outline">
                + Gerar Nova Chave
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
