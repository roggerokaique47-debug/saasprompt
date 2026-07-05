import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq, count, and } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { articles, articleCategories } from '@prompthub/database/src/schema/articles';
import { AdBanner, AdNative } from '@/components/ads/ad-banner';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artigos e Tutoriais',
  description: 'DocumentaÃ§Ã£o, tutoriais e guias sobre IA, automaÃ§Ã£o e prompts.',
};

interface PageProps {
  searchParams: Promise<{ type?: string; tag?: string; page?: string }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ArtigosPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const type = sp.type || '';
  const tag = sp.tag || '';
  const currentPage = Math.max(1, Number(sp.page) || 1);

  const conditions = [eq(articles.isPublished, true)];
  if (type) conditions.push(eq(articles.contentType, type));
  if (tag) conditions.push(eq(articles.tags, [tag]));

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const [allArticles, totalResult, categories] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(and(...conditions))
      .orderBy(desc(articles.createdAt))
      .limit(ITEMS_PER_PAGE)
      .offset(offset),
    db
      .select({ total: count() })
      .from(articles)
      .where(and(...conditions)),
    db.select().from(articleCategories).orderBy(articleCategories.name),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Artigos & Tutoriais</h1>
        <p className="mt-1 text-muted-foreground">
          DocumentaÃ§Ã£o, guias e conteÃºdos sobre IA, automaÃ§Ã£o com n8n e prompts
        </p>
      </div>

      <AdBanner className="mb-8" />

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/artigos"
          className={`rounded-full px-4 py-1.5 text-sm ${
            !type ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-primary'
          }`}
        >
          Todos
        </Link>
        {[
          { label: 'Tutoriais', value: 'tutorial' },
          { label: 'Guias', value: 'guide' },
          { label: 'DocumentaÃ§Ã£o', value: 'documentation' },
        ].map((t) => (
          <Link
            key={t.value}
            href={`/artigos?type=${t.value}`}
            className={`rounded-full px-4 py-1.5 text-sm ${
              type === t.value
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:border-primary'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {allArticles.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-16 text-center">
          <p className="text-lg font-medium">Nenhum artigo ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Seja o primeiro a contribuir!
          </p>
          <Link
            href="/artigos/novo"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
          >
            Escrever Artigo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allArticles.map((article) => (
            <Link
              key={article.id}
              href={`/artigos/${article.slug}`}
              className="group rounded-xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                  {article.contentType}
                </span>
                {article.isPremium && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    Premium
                  </span>
                )}
                {article.readTimeMinutes && (
                  <span className="text-xs text-muted-foreground">
                    {article.readTimeMinutes} min
                  </span>
                )}
              </div>
              <h2 className="mb-2 line-clamp-2 font-semibold group-hover:text-primary">
                {article.title}
              </h2>
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                {article.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {article.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {article.views} visualizaÃ§Ãµes
              </div>
            </Link>
          ))}
        </div>
      )}

      {total > ITEMS_PER_PAGE && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Mostrando {Math.min(ITEMS_PER_PAGE, total)} de {total} artigos
        </div>
      )}

      <AdNative className="mt-8" />
    </main>
  );
}

