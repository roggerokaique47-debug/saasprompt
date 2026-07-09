'use client';

import React from 'react';
import { Webhook, Send, Zap, Clock, GitMerge, Filter, MessageSquare, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';

const NODE_TYPES = [
  { type: 'webhook', label: 'Webhook Trigger', icon: Webhook, color: 'text-indigo-500' },
  { type: 'schedule', label: 'Schedule', icon: Clock, color: 'text-emerald-500' },
  { type: 'http_request', label: 'HTTP Request', icon: Send, color: 'text-blue-500' },
  { type: 'openai', label: 'OpenAI Prompt', icon: Zap, color: 'text-amber-500' },
  { type: 'slack_send', label: 'Slack Message', icon: MessageSquare, color: 'text-pink-500' },
  { type: 'discord_send', label: 'Discord Message', icon: MessageSquare, color: 'text-indigo-500' },
  { type: 'email_smtp', label: 'Send Email', icon: Mail, color: 'text-sky-500' },
  { type: 'whatsapp_send', label: 'Enviar WhatsApp', icon: MessageSquare, color: 'text-green-500' },
  { type: 'filter', label: 'Filter', icon: Filter, color: 'text-slate-500' },
  { type: 'merge', label: 'Merge', icon: GitMerge, color: 'text-violet-500' },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="w-64 h-full bg-white flex flex-col rounded-none border-r border-y-0 border-l-0 border-slate-200">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Blocos Disponíveis</h3>
        <p className="text-xs text-slate-500 mt-1">Arraste os blocos para o canvas</p>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-2">
        {NODE_TYPES.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:bg-slate-50 hover:border-slate-300 transition-colors"
              onDragStart={(event) => onDragStart(event, node.type, node.label)}
              draggable
            >
              <Icon className={`w-5 h-5 ${node.color}`} />
              <span className="text-sm font-medium text-slate-700">{node.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
