import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq, count, and, sql } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { AdBanner, AdSidebar } from '@/components/ads/ad-banner';
import { SortSelect } from '@/components/sort-select';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'n8n Workflows Prontos',
  description: 'AutomaÃ§Ãµes prontas para n8n. Baixe workflows de integraÃ§Ã£o, automaÃ§Ã£o e mais.',
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
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">âš¡ n8n Workflows Prontos</h1>
        <p className="mt-1 text-muted-foreground">
          AutomaÃ§Ãµes completas para n8n â€” baixe, importe e use
        </p>
      </div>

      <AdBanner className="mb-8" />

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Tags
              </h3>
              <div className="space-y-1">
                <Link
                  href="/workflows"
                  className={`block rounded-lg px-3 py-1.5 text-sm ${!tag ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  Todos
                </Link>
                {allTags.map((t) => (
                  <Link
                    key={t}
                    href={`/workflows?tag=${t}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm ${tag === t ? 'bg-primary/10 font-medium text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            <AdSidebar />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} workflow{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Ordenar:</label>
              <SortSelect
                defaultValue={sort}
                options={[
                  { value: 'downloads', label: 'Downloads' },
                  { value: 'newest', label: 'Novidades' },
                ]}
              />
            </div>
          </div>

          {allWorkflows.length === 0 ? (
            <div className="rounded-xl border border-border bg-white py-16 text-center">
              <p className="text-lg font-medium">Nenhum workflow ainda</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Compartilhe seu workflow com a comunidade!
              </p>
              <Link
                href="/workflows/novo"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
              >
                Publicar Workflow
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {allWorkflows.map((wf) => (
                <Link
                  key={wf.id}
                  href={`/workflows/${wf.slug}`}
                  className="group rounded-xl border border-border bg-white p-5 transition hover:border-primary hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
                      {wf.title}
                    </h3>
                    {wf.isPremium && (
                      <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                        ${(wf.priceCents / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {wf.description}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {wf.tags?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{wf.downloads} downloads</span>
                    <span>v{wf.n8nVersion}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

