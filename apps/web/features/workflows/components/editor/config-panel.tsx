'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfigPanelProps {
  selectedNode: any | null;
  onUpdateNode: (nodeId: string, data: any) => void;
}

export function ConfigPanel({ selectedNode, onUpdateNode }: ConfigPanelProps) {
  if (!selectedNode) {
    return (
      <Card className="w-80 h-full bg-white flex flex-col items-center justify-center rounded-none border-l border-y-0 border-r-0 border-slate-200 p-6 text-center">
        <p className="text-sm text-slate-500">Selecione um bloco no canvas para configurar seus parâmetros.</p>
      </Card>
    );
  }

  const { id, data, type } = selectedNode;
  const config = data.config || {};

  const handleChange = (field: string, value: any) => {
    onUpdateNode(id, {
      ...data,
      config: {
        ...config,
        [field]: value
      }
    });
  };

  const renderFields = () => {
    switch (data.type) {
      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Método</label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.method || 'POST'}
                onChange={(e) => handleChange('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500">
                A URL do seu webhook será gerada quando você salvar o workflow.
              </p>
            </div>
          </div>
        );

      case 'http_request':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
              <input
                type="url"
                placeholder="https://api.exemplo.com/dados"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Método</label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.method || 'GET'}
                onChange={(e) => handleChange('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        );

      case 'openai':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Modelo de IA</label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.model || 'gpt-4o-mini'}
                onChange={(e) => handleChange('model', e.target.value)}
              >
                <option value="gpt-4o-mini">GPT-4o Mini (1 Token/exec)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (3 Tokens/exec)</option>
                <option value="gpt-4o">GPT-4o (5 Tokens/exec)</option>
              </select>
              {config.model === 'gpt-4o' && (
                <p className="text-xs text-amber-600 mt-2 font-medium bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ Modelo de alto custo. Consome 5x mais tokens.
                </p>
              )}
              {config.model === 'claude-3-5-sonnet' && (
                <p className="text-xs text-indigo-600 mt-2 font-medium bg-indigo-50 p-2 rounded border border-indigo-200">
                  ℹ️ Excelente para códigos e lógica (Custo médio).
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prompt / Instrução</label>
              <textarea
                rows={4}
                placeholder="Ex: Resuma o texto fornecido."
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={config.prompt || ''}
                onChange={(e) => handleChange('prompt', e.target.value)}
              />
            </div>
          </div>
        );

      case 'discord_send':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.webhookUrl || ''}
                onChange={(e) => handleChange('webhookUrl', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
              <textarea
                rows={3}
                placeholder="Nova notificação recebida!"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={config.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
              />
            </div>
          </div>
        );

      case 'slack_send':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Canal ou ID do Usuário</label>
              <input
                type="text"
                placeholder="Ex: #general ou U123456"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs"
                value={config.channel || ''}
                onChange={(e) => handleChange('channel', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
              <textarea
                rows={4}
                placeholder="Nova notificação do sistema!"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={config.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
              />
            </div>
          </div>
        );

      case 'whatsapp_send':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Para (Telefone)</label>
              <input
                type="tel"
                placeholder="Ex: 5511999999999"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                value={config.to || ''}
                onChange={(e) => handleChange('to', e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1">Insira DDI + DDD + Número sem símbolos.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
              <textarea
                rows={4}
                placeholder="Olá! Segue sua notificação..."
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={config.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
              />
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700">
                A mensagem será enviada pelo WhatsApp pareado na sua conta.
              </p>
            </div>
          </div>
        );

      case 'email_smtp':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Para (To)</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.to || ''}
                onChange={(e) => handleChange('to', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
              <input
                type="text"
                placeholder="Aviso importante"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.subject || ''}
                onChange={(e) => handleChange('subject', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Corpo da Mensagem</label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={config.body || ''}
                onChange={(e) => handleChange('body', e.target.value)}
              />
            </div>
          </div>
        );

      case 'gmail_send':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Para (To)</label>
              <input
                type="email"
                placeholder="email@destino.com"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.to || ''}
                onChange={(e) => handleChange('to', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
              <input
                type="text"
                placeholder="Assunto do e-mail"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.subject || ''}
                onChange={(e) => handleChange('subject', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Corpo do E-mail</label>
              <textarea
                rows={4}
                placeholder="Olá, {{nome}}..."
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                value={config.body || ''}
                onChange={(e) => handleChange('body', e.target.value)}
              />
            </div>
          </div>
        );

      case 'gmail_read':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Query de Busca</label>
              <input
                type="text"
                placeholder="is:unread label:inbox"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.query || 'is:unread'}
                onChange={(e) => handleChange('query', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Máximo de Resultados</label>
              <input
                type="number"
                min="1"
                max="50"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.maxResults || 10}
                onChange={(e) => handleChange('maxResults', Number(e.target.value))}
              />
            </div>
          </div>
        );

      case 'google_sheets_read':
      case 'google_sheets_write':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Spreadsheet ID</label>
              <input
                type="text"
                placeholder="1BxiMVs0XRY..."
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs"
                value={config.spreadsheetId || ''}
                onChange={(e) => handleChange('spreadsheetId', e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1">O ID fica na URL da sua planilha.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Intervalo (Range)</label>
              <input
                type="text"
                placeholder="Página1!A1:D100"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                value={config.range || 'Sheet1!A1:Z1000'}
                onChange={(e) => handleChange('range', e.target.value)}
              />
            </div>
            {data.type === 'google_sheets_write' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Input Option</label>
                <select
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  value={config.valueInputOption || 'USER_ENTERED'}
                  onChange={(e) => handleChange('valueInputOption', e.target.value)}
                >
                  <option value="USER_ENTERED">Como se digitado (Recomendado)</option>
                  <option value="RAW">Dado Bruto</option>
                </select>
              </div>
            )}
          </div>
        );

      case 'google_drive_upload':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Folder ID (Opcional)</label>
              <input
                type="text"
                placeholder="1abcdefGHI..."
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs"
                value={config.folderId || ''}
                onChange={(e) => handleChange('folderId', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Arquivo</label>
              <input
                type="text"
                placeholder="relatorio.txt"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.fileName || ''}
                onChange={(e) => handleChange('fileName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">MIME Type</label>
              <input
                type="text"
                placeholder="text/plain"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.mimeType || 'text/plain'}
                onChange={(e) => handleChange('mimeType', e.target.value)}
              />
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequência</label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.frequency || 'hourly'}
                onChange={(e) => handleChange('frequency', e.target.value)}
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="cron">Expressão Cron Customizada</option>
              </select>
            </div>
            {config.frequency === 'cron' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expressão Cron</label>
                <input
                  type="text"
                  placeholder="0 * * * *"
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                  value={config.cronExpression || ''}
                  onChange={(e) => handleChange('cronExpression', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 'filter':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campo (Variável)</label>
              <input
                type="text"
                placeholder="Ex: payload.status"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs"
                value={config.field || ''}
                onChange={(e) => handleChange('field', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condição</label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.operator || 'equals'}
                onChange={(e) => handleChange('operator', e.target.value)}
              >
                <option value="equals">Igual a (==)</option>
                <option value="not_equals">Diferente de (!=)</option>
                <option value="contains">Contém</option>
                <option value="greater_than">Maior que (&gt;)</option>
                <option value="less_than">Menor que (&lt;)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor Esperado</label>
              <input
                type="text"
                placeholder="Ex: pago, true, 100"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.value || ''}
                onChange={(e) => handleChange('value', e.target.value)}
              />
            </div>
          </div>
        );

      case 'merge':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estratégia de Merge</label>
              <select
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                value={config.strategy || 'wait_all'}
                onChange={(e) => handleChange('strategy', e.target.value)}
              >
                <option value="wait_all">Aguardar todos os caminhos</option>
                <option value="pass_first">Prosseguir com o primeiro que chegar</option>
              </select>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500">
                O Merge combina dados de múltiplas origens em um único payload para o próximo bloco.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
            Configurações para o bloco <strong>{data.type}</strong> estarão disponíveis em breve.
          </div>
        );
    }
  };

  return (
    <Card className="w-80 h-full bg-white flex flex-col rounded-none border-l border-y-0 border-r-0 border-slate-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Configurações</h3>
        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">ID: {id.slice(0, 4)}</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {renderFields()}
      </div>
    </Card>
  );
}
