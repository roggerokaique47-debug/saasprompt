import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { categories } from '@prompthub/database/src/schema/categories';
import { eq, desc, count, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredPrompts = await db
    .select()
    .from(prompts)
    .where(eq(prompts.isFeatured, true))
    .orderBy(desc(prompts.downloads))
    .limit(6);

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      icon: categories.icon,
      count: count(prompts.id),
    })
    .from(categories)
    .leftJoin(prompts, eq(prompts.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(categories.name);

  const { totalPrompts } = (await db
    .select({
      totalPrompts: sql<number>`cast(count(*) as int)`,
    })
    .from(prompts))[0] ?? { totalPrompts: 0 };

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-20 pt-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-medium text-primary">
              {totalPrompts.toLocaleString()}+ prompts disponíveis
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              A Maior{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Biblioteca de Prompts
              </span>{' '}
              para IA
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Encontre, copie e baixe prompts prontos para ChatGPT, Claude,
              Gemini e mais. Todos testados e organizados por categoria.
            </p>

            <div className="mx-auto mb-8 max-w-xl">
              <Link
                href="/biblioteca"
                className="inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground hover:opacity-90"
              >
                Explorar Biblioteca
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <span>✦ Pronto para copiar</span>
              <span>✦ Download PDF/MD</span>
              <span>✦ Atualizado semanalmente</span>
              <span>✦ Grátis para começar</span>
            </div>
          </div>
        </div>
      </section>

      {featuredPrompts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold">Prompts em Destaque</h2>
                <p className="mt-2 text-muted-foreground">
                  Os prompts mais populares da semana
                </p>
              </div>
              <Link
                href="/biblioteca"
                className="hidden text-sm font-medium text-primary hover:underline sm:block"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPrompts.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/prompt/${prompt.slug}`}
                  className="group rounded-xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold group-hover:text-primary">
                      {prompt.title}
                    </h3>
                    <span className="shrink-0 text-sm text-amber-500">
                      ★ {Number(prompt.ratingAvg).toFixed(1)}
                    </span>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {prompt.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {(prompt.tags?.length ?? 0) > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{prompt.tags!.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{prompt.downloads} downloads</span>
                    <span>{prompt.language}</span>
                    {prompt.priceCents === 0 && (
                      <span className="text-success">Grátis</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/biblioteca"
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver todos os prompts →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Navegue por Categoria</h2>
            <p className="mt-2 text-muted-foreground">
              Encontre o prompt perfeito para sua necessidade
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/biblioteca/${cat.slug}`}
                className="group rounded-xl border border-border bg-white p-5 transition hover:border-primary hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{cat.icon}</div>
                <h3 className="font-semibold group-hover:text-primary">{cat.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {cat.count} prompts
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-10 text-center text-white md:p-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Comece a Usar Agora
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-white/80">
              Crie sua conta gratuita e tenha acesso a milhares de prompts
              prontos para copiar e baixar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-primary hover:opacity-90"
              >
                Cadastre-se Grátis
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/biblioteca"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10"
              >
                Explorar Biblioteca
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
