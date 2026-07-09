'use client';

import Link from 'next/link';
import { Bot, Zap, FileText, Globe, ArrowRight } from 'lucide-react';

const menuGroups = [
  {
    label: 'Prompts',
    href: '/biblioteca',
    icon: Bot,
    subs: [
      { label: 'Marketing', href: '/biblioteca/marketing' },
      { label: 'Programação', href: '/biblioteca/programacao' },
      { label: 'Design', href: '/biblioteca/design' },
      { label: 'Educação', href: '/biblioteca/educacao' },
      { label: 'Novidades', href: '/biblioteca?sort=newest' },
      { label: 'Em Destaque', href: '/biblioteca?isFeatured=true' },
    ],
  },
  {
    label: 'Workflows',
    href: '/workflows',
    icon: Zap,
    subs: [
      { label: 'Automação', href: '/workflows?tag=automacao' },
      { label: 'Integrações', href: '/workflows?tag=integracao' },
      { label: 'Notificação', href: '/workflows?tag=notificacao' },
      { label: 'API', href: '/workflows?tag=api' },
    ],
  },
  {
    label: 'Artigos',
    href: '/artigos',
    icon: FileText,
    subs: [
      { label: 'Tutoriais', href: '/artigos?type=tutorial' },
      { label: 'Guias', href: '/artigos?type=guide' },
      { label: 'Documentação', href: '/artigos?type=documentation' },
    ],
  },
  {
    label: 'Comunidade',
    href: '/comunidade',
    icon: Globe,
    subs: [
      { label: 'Criadores', href: '/comunidade' },
      { label: 'Submissões', href: '/artigos/novo' },
      { label: 'Vender Conteúdo', href: '/comunidade/criar-conta' },
    ],
  },
];

export function NavMenu() {
  return (
    <div className="hidden items-center gap-1 md:flex">
      {menuGroups.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.label} className="group relative">
            <Link
              href={group.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted group-hover:bg-muted group-hover:text-primary"
            >
              <Icon className="h-4 w-4" />
              {group.label}
            </Link>

            <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-white p-3 shadow-lg opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
              <div className="absolute -top-1 left-0 right-0 h-1" />
              {group.subs.map((sub) => (
                <Link
                  key={sub.label}
                  href={sub.href}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  {sub.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <Link
                  href={group.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                >
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
