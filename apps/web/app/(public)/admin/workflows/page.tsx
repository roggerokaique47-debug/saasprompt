import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Gerenciar Workflows' };

export default async function AdminWorkflowsPage() {
  const allWorkflows = await db
    .select()
    .from(workflows)
    .orderBy(desc(workflows.createdAt));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Workflows n8n</h1>
      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Premium</th>
              <th className="px-4 py-3 font-medium">Downloads</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
            </tr>
          </thead>
          <tbody>
            {allWorkflows.map((w) => (
              <tr key={w.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{w.title}</td>
                <td className="px-4 py-3">{w.isPremium ? `$${(w.priceCents / 100).toFixed(2)}` : '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{w.downloads}</td>
                <td className="px-4 py-3">
                  <span className={w.isPublished ? 'text-success' : 'text-muted-foreground'}>
                    {w.isPublished ? '✓' : 'Pendente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

