'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Webhook, FileText, Send, Zap, Filter, GitMerge, Code, Clock, GitFork, MessageSquare, Mail } from 'lucide-react';

const NODE_CONFIG = {
  webhook: { icon: Webhook, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  schedule: { icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  http_request: { icon: Send, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  openai: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  filter: { icon: Filter, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
  merge: { icon: GitMerge, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  code: { icon: Code, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
  delay: { icon: Clock, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  switch: { icon: GitFork, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  slack_send: { icon: MessageSquare, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
  discord_send: { icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  email_smtp: { icon: Mail, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' },
  gmail_send: { icon: Mail, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  gmail_read: { icon: Mail, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  google_sheets_read: { icon: FileText, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  google_sheets_write: { icon: FileText, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  whatsapp_send: { icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
} as const;

export const CustomNode = memo(({ data, selected }: any) => {
  const nodeType = data.type as keyof typeof NODE_CONFIG;
  const config = NODE_CONFIG[nodeType] || { icon: Play, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' };
  const Icon = config.icon;

  const isTrigger = nodeType === 'webhook' || nodeType === 'schedule';

  return (
    <div
      className={`relative min-w-[200px] rounded-xl border-2 p-3 shadow-sm transition-all bg-white
      ${selected ? 'border-primary ring-2 ring-primary/20 ring-offset-2' : config.border}
      `}
    >
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="h-3 w-3 border-2 border-white bg-slate-400"
        />
      )}

      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">{data.label}</span>
          <span className="text-xs text-slate-500 capitalize">{(nodeType || 'Node').replace('_', ' ')}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-3 w-3 border-2 border-white bg-slate-400"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
