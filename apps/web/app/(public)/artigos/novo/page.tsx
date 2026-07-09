import type { Metadata } from 'next';
import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { articleCategories } from '@prompthub/database/src/schema/articles';
import { ArticleForm } from '@/components/articles/article-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novo Artigo',
};

export default async function NovoArtigoPage() {
  const categories = await db.select().from(articleCategories).orderBy(articleCategories.name);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/artigos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        ← Artigos
      </Link>
      <h1 className="mb-8 text-3xl font-bold">Escrever Artigo</h1>
      <ArticleForm categories={categories} />
    </main>
  );
}

