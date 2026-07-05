import type { Metadata } from 'next';
import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { categories } from '@prompthub/database/src/schema/categories';
import { eq, ilike, or, and, desc, sql, count, type SQL } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Biblioteca de Prompts',
  description:
    'Explore milhares de prompts prontos para ChatGPT, Claude, Gemini e mais.',
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    modelo?: string;
    preco?: string;
    idioma?: string;
    sort?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 18;

export default async function BibliotecaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const categoriaSlug = params.categoria || '';
  const modelo = params.modelo || '';
  const preco = params.preco || '';
  const idioma = params.idioma || '';
  const sort = params.sort || 'relevance';
  const currentPage = Math.max(1, Number(params.page) || 1);

  const conditions = [eq(prompts.isPublished, true)];

  if (query) {
    const searchPattern = `%${query}%`;
    const searchConditions = [
      ilike(prompts.title, searchPattern),
      ilike(prompts.description, searchPattern),
      ilike(prompts.content, searchPattern),
    ].filter(Boolean) as SQL<unknown>[];
    conditions.push(
      or(...searchConditions) ??
        sql`1=0`,
    );
  }

  if (categoriaSlug) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, categoriaSlug))
      .limit(1);
    if (cat) {
      conditions.push(eq(prompts.categoryId, cat.id));
    }
  }

  if (modelo) {
    conditions.push(sql`${modelo} = ANY(${prompts.model})`);
  }

  if (preco === 'gratis') {
    conditions.push(eq(prompts.priceCents, 0));
  } else if (preco === 'pago') {
    conditions.push(sql`${prompts.priceCents} > 0`);
  }

  if (idioma) {
    conditions.push(eq(prompts.language, idioma));
  }

  const where = and(...conditions);

  const orderBy =
    sort === 'downloads'
      ? desc(prompts.downloads)
      : sort === 'rating'
        ? desc(prompts.ratingAvg)
        : sort === 'newest'
          ? desc(prompts.createdAt)
          : desc(prompts.views);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [allPrompts, totalResult, allCategories] = await Promise.all([
    db
      .select()
      .from(prompts)
      .where(where)
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(prompts)
      .where(where),
    db.select().from(categories).orderBy(categories.name),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Biblioteca de Prompts</h1>
        <p className="mt-1 text-muted-foreground">
          {total} prompts encontrados
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
              placeholder="Pesquise por tÃ­tulo, descriÃ§Ã£o ou tags..."
              className="w-full rounded-xl border border-border bg-white px-4 py-3 pl-11 outline-none focus:border-primary"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Ordenar:</label>
          <select
            className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none"
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('sort', e.target.value);
              window.location.href = url.toString();
            }}
            defaultValue={sort}
          >
            <option value="relevance">RelevÃ¢ncia</option>
            <option value="downloads">Downloads</option>
            <option value="rating">AvaliaÃ§Ã£o</option>
            <option value="newest">Novidades</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Categorias
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/biblioteca"
                    className={`block rounded-lg px-3 py-1.5 text-sm ${
                      !categoriaSlug
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Todas
                  </Link>
                </li>
                {allCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/biblioteca?categoria=${cat.slug}`}
                      className={`block rounded-lg px-3 py-1.5 text-sm ${
                        categoriaSlug === cat.slug
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Modelo AI
              </h3>
              <div className="space-y-1">
                {['chatgpt', 'claude', 'gemini', 'midjourney', 'dall-e', 'flux'].map(
                  (m) => (
                    <Link
                      key={m}
                      href={`/biblioteca?modelo=${m}`}
                      className={`block rounded-lg px-3 py-1.5 text-sm capitalize ${
                        modelo === m
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {m}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                PreÃ§o
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Todos', value: '' },
                  { label: 'GrÃ¡tis', value: 'gratis' },
                  { label: 'Pagos', value: 'pago' },
                ].map((p) => (
                  <Link
                    key={p.value}
                    href={`/biblioteca${p.value ? `?preco=${p.value}` : ''}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm ${
                      preco === p.value
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Idioma
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Todos', value: '' },
                  { label: 'PortuguÃªs', value: 'pt-BR' },
                  { label: 'English', value: 'en-US' },
                  { label: 'English UK', value: 'en-GB' },
                ].map((l) => (
                  <Link
                    key={l.value}
                    href={`/biblioteca${l.value ? `?idioma=${l.value}` : ''}`}
                    className={`block rounded-lg px-3 py-1.5 text-sm ${
                      idioma === l.value
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {allPrompts.length === 0 ? (
            <div className="rounded-xl border border-border bg-white py-16 text-center">
              <p className="text-lg font-medium">Nenhum prompt encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <Link
                href="/biblioteca"
                className="mt-4 inline-block text-sm text-primary hover:underline"
              >
                Limpar filtros
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {allPrompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={`/prompt/${prompt.slug}`}
                    className="group rounded-xl border border-border bg-white p-5 transition hover:border-primary hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 font-semibold group-hover:text-primary">
                        {prompt.title}
                      </h3>
                      <span className="shrink-0 text-sm text-amber-500">
                        â˜… {Number(prompt.ratingAvg).toFixed(1)}
                      </span>
                    </div>

                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {prompt.description}
                    </p>

                    <div className="mb-3 flex flex-wrap gap-1">
                      {prompt.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{prompt.downloads} downloads</span>
                      <span>{prompt.language}</span>
                      {prompt.priceCents === 0 && (
                        <span className="font-medium text-success">GrÃ¡tis</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/biblioteca?page=${currentPage - 1}`}
                      className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                    >
                      Anterior
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - currentPage) <= 2,
                    )
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-1">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-muted-foreground">...</span>
                        )}
                        <Link
                          href={`/biblioteca?page=${p}`}
                          className={`rounded-lg px-3 py-2 text-sm ${
                            p === currentPage
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border hover:bg-muted'
                          }`}
                        >
                          {p}
                        </Link>
                      </span>
                    ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/biblioteca?page=${currentPage + 1}`}
                      className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                    >
                      PrÃ³xima
                    </Link>
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

