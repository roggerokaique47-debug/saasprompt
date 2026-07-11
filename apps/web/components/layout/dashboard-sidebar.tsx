'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from './logout-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Webhook, Send, Zap, Clock, GitMerge, Filter, MessageSquare, Mail, Home, Plus, Library, Settings, Smartphone, CreditCard, Briefcase, Store, Activity } from 'lucide-react';

const NODE_TYPES = [
  { type: 'webhook', label: 'Webhook Trigger', icon: Webhook, color: 'text-indigo-500' },
  { type: 'schedule', label: 'Schedule', icon: Clock, color: 'text-emerald-500' },
  { type: 'http_request', label: 'HTTP Request', icon: Send, color: 'text-blue-500' },
  { type: 'openai', label: 'OpenAI Prompt', icon: Zap, color: 'text-amber-500' },
  { type: 'slack_send', label: 'Slack Message', icon: MessageSquare, color: 'text-pink-500' },
  { type: 'discord_send', label: 'Discord Message', icon: MessageSquare, color: 'text-indigo-500' },
  { type: 'email_smtp', label: 'Send Email', icon: Mail, color: 'text-sky-500' },
  { type: 'filter', label: 'Filter', icon: Filter, color: 'text-slate-500' },
  { type: 'merge', label: 'Merge', icon: GitMerge, color: 'text-violet-500' },
];

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const isEditor = pathname?.includes('/edit');

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex z-50 h-full">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M10 22V10l6 6 6-6v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          NovaFlow
        </Link>
      </div>

      <nav className="space-y-1 px-4 py-4 shrink-0">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === '/dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Home className="w-[18px] h-[18px]" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/workflows/novo/edit"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname?.includes('/novo/edit') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Plus className="w-[18px] h-[18px]" />
          Criar Workflow
        </Link>
        <Link
          href="/dashboard/templates"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname?.includes('/dashboard/templates') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Library className="w-[18px] h-[18px]" />
          Templates
        </Link>
        <Link
          href="/dashboard/agentes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname?.includes('/dashboard/agentes') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Briefcase className="w-[18px] h-[18px]" />
          Funcionários de IA
        </Link>
        <Link
          href="/dashboard/marketplace"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname?.includes('/dashboard/marketplace') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Store className="w-[18px] h-[18px]" />
          Marketplace
        </Link>
        <Link
          href="/dashboard/execucoes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname?.includes('/dashboard/execucoes') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Activity className="w-[18px] h-[18px]" />
          Execuções
        </Link>
        <Link
          href="/dashboard/afiliados"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname?.includes('/dashboard/afiliados') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Zap className="w-[18px] h-[18px]" />
          Afiliados
        </Link>
        <Link
          href="/dashboard/integracoes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === '/dashboard/integracoes' ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Zap className="w-[18px] h-[18px]" />
          Integrações
        </Link>
        <Link
          href="/dashboard/whatsapp"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === '/dashboard/whatsapp' ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Smartphone className="w-[18px] h-[18px]" />
          WhatsApp
        </Link>
        <Link
          href="/dashboard/faturamento"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === '/dashboard/faturamento' ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <CreditCard className="w-[18px] h-[18px]" />
          Faturamento
        </Link>
      </nav>

      {/* Se estiver no editor, mostrar blocos */}
      {isEditor ? (
        <div className="flex-1 overflow-y-auto border-t border-slate-100">
          <div className="px-5 py-3 sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">Blocos Disponíveis</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Arraste para o canvas</p>
          </div>
          <div className="p-4 space-y-2">
            {NODE_TYPES.map((node) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.type}
                  className="flex items-center gap-3 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                  onDragStart={(event) => onDragStart(event, node.type, node.label)}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('add-workflow-node', {
                      detail: { type: node.type, label: node.label }
                    }));
                  }}
                  draggable
                >
                  <Icon className={`w-[18px] h-[18px] ${node.color}`} />
                  <span className="text-xs font-medium text-slate-700">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* User Profile no final da Sidebar */}
      <div className="shrink-0 border-t border-slate-200 p-4 bg-slate-50/50">
        {user && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm ring-2 ring-white">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-xs font-bold text-slate-900 leading-tight" title={user.email}>
                  {user.email?.split('@')[0] || 'Usuário'}
                </span>
                <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-wider">
                  Plano Pro
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ThemeToggle />
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
