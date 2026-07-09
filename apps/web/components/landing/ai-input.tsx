'use client';

import { useState } from 'react';

export function AiInput() {
  const [query, setQuery] = useState('');

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-3 text-3xl font-bold">
          O que você deseja automatizar?
        </h2>
        <p className="mb-8 text-muted-foreground">
          Descreva seu processo e a IA cria o workflow para você
        </p>

        <div className="group relative mx-auto max-w-2xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-50 blur-lg transition group-focus-within:opacity-100" />
          <div className="relative flex items-center gap-2 rounded-xl border border-border bg-white p-2 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: Quero responder clientes do WhatsApp automaticamente"
              className="flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-muted-foreground/60"
            />
            <button
              className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Gerar
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const suggestions = [
  'Responder WhatsApp',
  'Extrair dados de nota fiscal',
  'Gerar relatórios semanais',
  'Integrar CRM com e-mail',
];
