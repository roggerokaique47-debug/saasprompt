import type { Metadata } from 'next';
import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { workflows, workflowCategories } from '@prompthub/database/src/schema/workflows';
import { eq, ilike, or, and, desc, sql, count, type SQL } from 'drizzle-orm';
import { SortSelect } from '@/components/sort-select';
import { Users, Star, Download, Play, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Marketplace de Templates | NovaFlow AI',
  description: 'Descubra workflows prontos para automatizar seu negócio instantaneamente.',
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    app?: string;
    preco?: string;
    sort?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 18;

// Integration options based on common apps
const INTEGRATION_APPS = ['Gmail', 'Slack', 'Stripe', 'WhatsApp', 'Notion', 'Shopify'];

export default async function BibliotecaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const categoriaSlug = params.categoria || '';
  const appFilter = params.app || '';
  const preco = params.preco || '';
  const sort = params.sort || 'relevance';
  const currentPage = Math.max(1, Number(params.page) || 1);

  const conditions = [eq(workflows.isPublished, true)];

  if (query) {
    const searchPattern = `%${query}%`;
    const searchConditions = [
      ilike(workflows.title, searchPattern),
      ilike(workflows.description, searchPattern),
    ].filter(Boolean) as SQL<unknown>[];
    conditions.push(
      or(...searchConditions) ?? sql`1=0`,
    );
  }

  if (categoriaSlug) {
    const [cat] = await db
      .select({ id: workflowCategories.id })
      .from(workflowCategories)
      .where(eq(workflowCategories.slug, categoriaSlug))
      .limit(1);
    if (cat) {
      conditions.push(eq(workflows.categoryId, cat.id));
    }
  }

  if (appFilter) {
    conditions.push(sql`${appFilter} = ANY(${workflows.tags})`);
  }

  if (preco === 'gratis') {
    conditions.push(eq(workflows.isPremium, false));
  } else if (preco === 'pago') {
    conditions.push(eq(workflows.isPremium, true));
  }

  const where = and(...conditions);

  const orderBy =
    sort === 'downloads'
      ? desc(workflows.downloads)
      : sort === 'rating'
        ? desc(workflows.ratingAvg)
        : sort === 'newest'
          ? desc(workflows.createdAt)
          : desc(workflows.views);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [allWorkflows, totalResult, allCategories] = await Promise.all([
    db
      .select()
      .from(workflows)
      .where(where)
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(workflows)
      .where(where),
    db.select().from(workflowCategories).orderBy(workflowCategories.name),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
          Marketplace de Automações
        </h1>
        <p className="mt-2 text-muted-foreground">
          Descubra {total} workflows prontos para impulsionar a sua operação.
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <form method="GET" action="/biblioteca">
            {params.sort && <input type="hidden" name="sort" value={params.sort} />}
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Pesquise por casos de uso, Ex: 'CRM WhatsApp', 'Recuperação de Carrinho'..."
              className="w-full rounded-xl border border-border bg-white px-4 py-3 pl-11 outline-none focus:border-primary shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</label>
          <SortSelect
            defaultValue={sort}
            options={[
              { value: 'relevance', label: 'Relevância' },
              { value: 'downloads', label: 'Mais Clonados' },
              { value: 'rating', label: 'Melhor Avaliados' },
              { value: 'newest', label: 'Adicionados Recentemente' },
            ]}
          />
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Categorias de Negócio */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Áreas de Negócio
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/biblioteca"
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      !categoriaSlug ? 'bg-purple-100 font-medium text-purple-700' : 'text-muted-foreground hover:bg-slate-100'
                    }`}
                  >
                    Todas as Áreas
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/biblioteca?categoria=${cat.slug}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        categoriaSlug === cat.slug ? 'bg-purple-100 font-medium text-purple-700' : 'text-muted-foreground hover:bg-slate-100'
                      }`}
                    >
                      <span className="mr-2 text-lg">{cat.icon}</span> {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apps Connectados */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Integrações
              </h3>
              <div className="space-y-1">
                {INTEGRATION_APPS.map((app) => (
                  <Link
                    key={app}
                    href={`/biblioteca?app=${app}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      appFilter === app ? 'bg-purple-100 font-medium text-purple-700' : 'text-muted-foreground hover:bg-slate-100'
                    }`}
                  >
                    {app}
                  </Link>
                ))}
              </div>
            </div>

            {/* Precificação */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Preço
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Todos', value: '' },
                  { label: 'Templates Gratuitos', value: 'gratis' },
                  { label: 'Templates Premium', value: 'pago' },
                ].map((p) => (
                  <Link
                    key={p.value}
                    href={`/biblioteca${p.value ? `?preco=${p.value}` : ''}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      preco === p.value ? 'bg-purple-100 font-medium text-purple-700' : 'text-muted-foreground hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {allWorkflows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <p className="text-lg font-medium text-slate-800">Nenhum template encontrado</p>
              <p className="mt-1 text-sm text-slate-500">
                Tente ajustar os filtros ou pesquisar por outras palavras-chave.
              </p>
              <Link href="/biblioteca" className="mt-4 inline-block text-sm font-medium text-purple-600 hover:underline">
                Limpar todos os filtros
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {allWorkflows.map((workflow) => (
                  <Link
                    key={workflow.id}
                    href={`/biblioteca/template/${workflow.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-purple-300 hover:shadow-lg"
                  >
                    <div>
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-purple-700">
                          {workflow.title}
                        </h3>
                        <div className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {Number(workflow.ratingAvg).toFixed(1)}
                        </div>
                      </div>

                      <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                        {workflow.description}
                      </p>

                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {workflow.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-600"
                          >
                            <Zap className="mr-1 h-3 w-3 text-purple-500" />
                            {tag}
                          </span>
                        ))}
                        {(workflow.tags?.length || 0) > 3 && (
                          <span className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                            +{(workflow.tags?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        {workflow.downloads} clones
                      </div>
                      <div className="flex items-center gap-1.5">
                        {workflow.isPremium ? (
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700">Premium</span>
                        ) : (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">Grátis</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {/* Paginacao omitida por brevidade (mesma logica do original) */}
                  {currentPage > 1 && (
                    <Link href={`/biblioteca?page=${currentPage - 1}`} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">Anterior</Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={`/biblioteca?page=${p}`} className={`rounded-lg px-3 py-2 text-sm ${p === currentPage ? 'bg-purple-600 text-white' : 'border border-border hover:bg-slate-50'}`}>
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link href={`/biblioteca?page=${currentPage + 1}`} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">Próxima</Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
