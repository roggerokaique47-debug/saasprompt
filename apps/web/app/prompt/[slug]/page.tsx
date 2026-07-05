import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { categories } from '@prompthub/database/src/schema/categories';
import { CopyButton } from '@/components/prompts/copy-button';
import { PremiumGate } from '@/components/premium/premium-gate';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.slug, slug))
    .limit(1);

  if (!prompt) return { title: 'Prompt não encontrado' };

  return {
    title: prompt.title,
    description: prompt.description ?? `Prompt de ${prompt.language} para ${prompt.model?.join(', ')}`,
  };
}

export default async function PromptPage({ params }: PageProps) {
  const { slug } = await params;

  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.slug, slug))
    .limit(1);

  if (!prompt) notFound();

  const [category] = prompt.categoryId
    ? await db
        .select()
        .from(categories)
        .where(eq(categories.id, prompt.categoryId))
        .limit(1)
    : [];

  const related = prompt.categoryId
    ? await db
        .select()
        .from(prompts)
        .where(eq(prompts.categoryId, prompt.categoryId))
        .limit(3)
    : [];

  if (!prompt.isPublished) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/biblioteca"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para Biblioteca
      </Link>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {category && (
            <Link
              href={`/biblioteca/${category.slug}`}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {category.icon} {category.name}
            </Link>
          )}
          {prompt.model?.map((m) => (
            <span
              key={m}
              className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
            >
              {m}
            </span>
          ))}
          {prompt.priceCents === 0 ? (
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Grátis
            </span>
          ) : (
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
              ${(prompt.priceCents / 100).toFixed(2)}
            </span>
          )}
          <span className="rounded-full bg-muted/50 px-3 py-1 text-xs font-medium">
            {prompt.language}
          </span>
        </div>

        <h1 className="mb-2 text-4xl font-bold">{prompt.title}</h1>

        {prompt.description && (
          <p className="mb-4 text-lg text-muted-foreground">{prompt.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="text-amber-500">★</span>
            {Number(prompt.ratingAvg).toFixed(1)} ({prompt.ratingCount} avaliações)
          </span>
          <span>{prompt.downloads} downloads</span>
          <span>{prompt.views} visualizações</span>
        </div>
      </div>

      <PremiumGate
        contentType="prompt"
        contentId={prompt.id}
        priceCents={prompt.priceCents}
        title={prompt.title}
      >
        <div className="mb-6 rounded-xl border border-border bg-white">
          <div className="border-b border-border px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Prompt
              </span>
              <CopyButton content={prompt.content} />
            </div>
          </div>
          <div className="overflow-x-auto p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {prompt.content}
            </pre>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <CopyButton content={prompt.content} variant="large" />
          <button
            onClick={() => {
              const blob = new Blob([prompt.content], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${prompt.slug}.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            📝 Download MD
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
          >
            📄 Download PDF
          </button>
        </div>
      </PremiumGate>

      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Link
              key={tag}
              href={`/biblioteca?q=${tag}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {related.length > 1 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Prompts Relacionados</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related
              .filter((r) => r.id !== prompt.id)
              .slice(0, 3)
              .map((r) => (
                <Link
                  key={r.id}
                  href={`/prompt/${r.slug}`}
                  className="rounded-xl border border-border bg-white p-4 transition hover:border-primary"
                >
                  <h3 className="line-clamp-1 font-medium">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
