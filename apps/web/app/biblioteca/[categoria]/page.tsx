import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eq, desc, count, and } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { categories } from '@prompthub/database/src/schema/categories';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { SortSelect } from '@/components/sort-select';

interface PageProps {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<{
    q?: string;
    modelo?: string;
    preco?: string;
    idioma?: string;
    sort?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 18;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categoria))
    .limit(1);

  if (!cat) return { title: 'Categoria não encontrada' };

  return {
    title: `${cat.icon} ${cat.name}`,
    description: `Encontre os melhores prompts de ${cat.name} para IA.`,
  };
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { categoria } = await params;
  const sp = await searchParams;
  const sort = sp.sort || 'downloads';
  const currentPage = Math.max(1, Number(sp.page) || 1);

  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categoria))
    .limit(1);

  if (!cat) notFound();

  const conditions = [
    eq(prompts.isPublished, true),
    eq(prompts.categoryId, cat.id),
  ];

  const orderBy =
    sort === 'downloads'
      ? desc(prompts.downloads)
      : sort === 'rating'
        ? desc(prompts.ratingAvg)
        : sort === 'newest'
          ? desc(prompts.createdAt)
          : desc(prompts.views);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [catPrompts, totalResult] = await Promise.all([
    db
      .select()
      .from(prompts)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(prompts)
      .where(and(...conditions)),
  ]);

  const total = totalResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const subcategoryTags = [
    ...new Set(catPrompts.flatMap((p) => p.tags ?? [])),
  ].slice(0, 12);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-2">
        <Link
          href="/biblioteca"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Biblioteca
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{cat.name}</h1>
            <p className="text-muted-foreground">
              {total} prompts • {cat.description}
            </p>
          </div>
        </div>
      </div>

      {subcategoryTags.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Subcategorias
          </h3>
          <div className="flex flex-wrap gap-2">
            {subcategoryTags.map((tag) => (
              <Link
                key={tag}
                href={`/biblioteca/${categoria}?q=${tag}`}
                className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary hover:text-primary"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} prompt{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Ordenar:</label>
          <SortSelect
            defaultValue={sort}
            options={[
              { value: 'downloads', label: 'Downloads' },
              { value: 'rating', label: 'Avaliação' },
              { value: 'newest', label: 'Novidades' },
            ]}
          />
        </div>
      </div>

      {catPrompts.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-16 text-center">
          <p className="text-lg font-medium">Nenhum prompt nesta categoria</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Em breve adicionaremos novos prompts aqui
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {catPrompts.map((prompt) => (
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
                    ★ {Number(prompt.ratingAvg).toFixed(1)}
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
                    <span className="font-medium text-success">Grátis</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/biblioteca/${categoria}?page=${currentPage - 1}`}
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
                      href={`/biblioteca/${categoria}?page=${p}`}
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
                  href={`/biblioteca/${categoria}?page=${currentPage + 1}`}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                >
                  Próxima
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
