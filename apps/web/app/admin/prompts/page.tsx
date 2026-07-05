import type { Metadata } from 'next';
import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gerenciar Prompts',
};

export default async function AdminPromptsPage() {
  const allPrompts = await db
    .select()
    .from(prompts)
    .orderBy(desc(prompts.createdAt))
    .limit(50);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prompts</h1>
        <Link
          href="/admin/prompts/novo"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Novo Prompt
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">TÃ­tulo</th>
              <th className="px-4 py-3 font-medium">Idioma</th>
              <th className="px-4 py-3 font-medium">PreÃ§o</th>
              <th className="px-4 py-3 font-medium">Downloads</th>
              <th className="px-4 py-3 font-medium">Publicado</th>
              <th className="px-4 py-3 font-medium">AÃ§Ãµes</th>
            </tr>
          </thead>
          <tbody>
            {allPrompts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum prompt encontrado.
                </td>
              </tr>
            )}
            {allPrompts.map((prompt) => (
              <tr key={prompt.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{prompt.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{prompt.language}</td>
                <td className="px-4 py-3">
                  {prompt.priceCents === 0 ? (
                    <span className="text-success">GrÃ¡tis</span>
                  ) : (
                    `$${(prompt.priceCents / 100).toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-3">{prompt.downloads}</td>
                <td className="px-4 py-3">
                  {prompt.isPublished ? (
                    <span className="text-success">âœ“</span>
                  ) : (
                    <span className="text-muted-foreground">â€”</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/prompts/${prompt.id}/edit`}
                    className="text-primary hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

