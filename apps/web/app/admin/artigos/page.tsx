import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { articles } from '@prompthub/database/src/schema/articles';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gerenciar Artigos' };

export default async function AdminArtigosPage() {
  const allArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Artigos</h1>
      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">TÃ­tulo</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Premium</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
              <th className="px-4 py-3 font-medium">Views</th>
            </tr>
          </thead>
          <tbody>
            {allArticles.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{a.contentType}</td>
                <td className="px-4 py-3">{a.isPremium ? `$${(a.priceCents / 100).toFixed(2)}` : 'â€”'}</td>
                <td className="px-4 py-3">
                  <span className={a.isPublished ? 'text-success' : 'text-muted-foreground'}>
                    {a.isPublished ? 'âœ“' : 'Pendente'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

