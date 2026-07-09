import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq, count, and, sql } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { AdBanner, AdSidebar } from '@/components/ads/ad-banner';
import { SortSelect } from '@/components/sort-select';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workflows Prontos',
  description: 'Automações prontas para NovaFlow AI. Use workflows de integração, automação e mais.',
};

const ITEMS_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ tag?: string; sort?: string; page?: string }>;
}

export default async function WorkflowsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tag = sp.tag || '';
  const sort = sp.sort || 'downloads';
  const currentPage = Math.max(1, Number(sp.page) || 1);

  const conditions = [eq(workflows.isPublished, true)];
  if (tag) conditions.push(eq(workflows.tags, [tag]));

  const orderBy = sort === 'newest'
    ? desc(workflows.createdAt)
    : desc(workflows.downloads);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [allWorkflows, totalResult] = await Promise.all([
    db
      .select()
      .from(workflows)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(workflows)
      .where(and(...conditions)),
  ]);

  const total = totalResult[0]?.total ?? 0;

  const allTags = [...new Set(allWorkflows.flatMap((w) => w.tags ?? []))];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section Local */}
      <div className="relative overflow-hidden bg-zinc-950 px-4 py-16 text-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-zinc-950 to-zinc-950"></div>
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Marketplace de <span className="text-primary">Automações</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Descubra fluxos prontos e Agentes de IA construídos pela comunidade e verificados pelos nossos engenheiros. Instale em 1 clique.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <AdBanner className="mb-8 rounded-xl border border-border shadow-sm" />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Categorias
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/workflows"
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${!tag ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    Todas as Automações
                  </Link>
                  {allTags.map((t) => (
                    <Link
                      key={t}
                      href={`/workflows?tag=${t}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${tag === t ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              <AdSidebar className="rounded-xl border border-border shadow-sm" />
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Exibindo <span className="text-foreground">{total}</span> automaç{total !== 1 ? 'ões' : 'ão'}
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-muted-foreground">Ordenar por:</label>
                <SortSelect
                  defaultValue={sort}
                  options={[
                    { value: 'downloads', label: 'Mais Baixados' },
                    { value: 'newest', label: 'Lançamentos' },
                  ]}
                />
              </div>
            </div>

            {allWorkflows.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-24 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <span className="text-xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold">Nenhuma automação encontrada</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Ninguém publicou uma automação com essa categoria ainda. Seja o primeiro!
                </p>
                <Link
                  href="/workflows/novo"
                  className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  Criar Workflow
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {allWorkflows.map((wf) => (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.slug}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div>
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        {wf.isPremium ? (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                            PRO ${(wf.priceCents / 100).toFixed(2)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            GRÁTIS
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 line-clamp-1 font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {wf.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {wf.description}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {wf.tags?.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          {wf.downloads} installs
                        </div>
                        <span className="text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Instalar &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

