import type { Metadata } from 'next';
import { getArticles } from '@/features/articles';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gerenciar Artigos' };

export default async function AdminArtigosPage() {
  const result = await getArticles();
  
  if (result.error) {
    return <div className="p-4 text-error">Erro: {result.error}</div>;
  }

  const allArticles = result.data || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artigos</h1>
        <Link
          href="/artigos/novo"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Novo Artigo
        </Link>
      </div>
      
      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
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
                <td className="px-4 py-3">{a.isPremium ? `$${(a.priceCents / 100).toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3">
                  <span className={a.isPublished ? 'text-success' : 'text-muted-foreground'}>
                    {a.isPublished ? '✓' : 'Pendente'}
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
