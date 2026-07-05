'use client';

import Link from 'next/link';
import { useState } from 'react';

const menuGroups = [
  {
    label: 'Prompts',
    href: '/biblioteca',
    icon: '🤖',
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
    label: 'n8n Workflows',
    href: '/workflows',
    icon: '⚡',
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
    icon: '📝',
    subs: [
      { label: 'Tutoriais', href: '/artigos?type=tutorial' },
      { label: 'Guias', href: '/artigos?type=guide' },
      { label: 'Documentação', href: '/artigos?type=documentation' },
    ],
  },
  {
    label: 'Comunidade',
    href: '/comunidade',
    icon: '🌍',
    subs: [
      { label: 'Criadores', href: '/comunidade' },
      { label: 'Submissões', href: '/artigos/novo' },
      { label: 'Vender Conteúdo', href: '/comunidade/criar-conta' },
    ],
  },
];

export function NavMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="hidden items-center gap-1 md:flex">
      {menuGroups.map((group) => (
        <div
          key={group.label}
          className="relative"
          onMouseEnter={() => setOpen(group.label)}
          onMouseLeave={() => setOpen(null)}
        >
          <Link
            href={group.href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              open === group.label ? 'bg-muted text-primary' : 'hover:bg-muted'
            }`}
          >
            <span>{group.icon}</span>
            {group.label}
            <svg
              className={`h-3 w-3 transition-transform ${
                open === group.label ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Link>

          {open === group.label && (
            <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-white p-3 shadow-lg">
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
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                >
                  Ver todos →
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
