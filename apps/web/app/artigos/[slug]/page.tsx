import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { articles, articleCategories } from '@prompthub/database/src/schema/articles';
import { AdBanner, AdNative } from '@/components/ads/ad-banner';
import { PremiumGate } from '@/components/premium/premium-gate';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!article) return { title: 'Artigo não encontrado' };

  return {
    title: article.title,
    description: article.description ?? '',
  };
}

export default async function ArtigoPage({ params }: PageProps) {
  const { slug } = await params;

  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!article || !article.isPublished) notFound();

  const [cat] = article.categoryId
    ? await db
        .select()
        .from(articleCategories)
        .where(eq(articleCategories.id, article.categoryId))
        .limit(1)
    : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/artigos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        ← Artigos
      </Link>

      <article>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {cat && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {cat.icon} {cat.name}
            </span>
          )}
          <span className="rounded-full bg-muted/50 px-3 py-1 text-xs capitalize text-muted-foreground">
            {article.contentType}
          </span>
          {article.isPremium && (
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
              Premium — ${(article.priceCents / 100).toFixed(2)}
            </span>
          )}
          {article.readTimeMinutes && (
            <span className="text-xs text-muted-foreground">
              {article.readTimeMinutes} min de leitura
            </span>
          )}
        </div>

        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>

        {article.description && (
          <p className="mb-6 text-lg text-muted-foreground">{article.description}</p>
        )}

        <AdBanner className="mb-8" />

        <PremiumGate
          contentType="article"
          contentId={article.id}
          priceCents={article.isPremium ? article.priceCents : 0}
          title={article.title}
        >
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/\n/g, '<br/>')
                .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-muted rounded-lg p-4 overflow-x-auto font-mono text-sm my-4">$2</pre>')
                .replace(/### (.+)/g, '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>')
                .replace(/## (.+)/g, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
                .replace(/# (.+)/g, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>'),
            }}
          />
        </PremiumGate>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/artigos?tag=${tag}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      <AdNative className="mt-8" />
    </main>
  );
}
