import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { eq, desc } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';

export const metadata: Metadata = {
  title: 'Marketplace de Templates - NovaFlow AI',
  description: 'Descubra automações incríveis criadas pela comunidade.',
};

export default async function ComunidadePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Buscar templates públicos
  const publicWorkflows = await db.select()
    .from(workflows)
    .where(eq(workflows.isPublished, true))
    .orderBy(desc(workflows.downloads));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Marketplace de Automacoes</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Economize dias de trabalho clonando templates pr&eacute;-configurados criados pela comunidade e especialistas.
        </p>
      </div>

      {publicWorkflows.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground text-lg mb-4">Nenhum template publicado ainda.</p>
          {user && (
            <Link href="/workflows/novo" className="text-primary font-semibold hover:underline">
              Seja o primeiro a publicar um workflow!
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publicWorkflows.map((workflow) => (
            <div key={workflow.id} className="group flex flex-col justify-between rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {workflow.isPremium ? 'Premium' : 'Gratuito'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <span>⬇️</span> {workflow.downloads}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{workflow.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {workflow.description || 'Um workflow incrivel para automatizar suas tarefas.'}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                {user ? (
                  <form action={`/api/workflows/fork?id=${workflow.id}`} method="POST">
                    <button type="submit" className="w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:bg-primary/90 flex items-center justify-center gap-2">
                      <span>🔄</span> Clonar para meu Workspace
                    </button>
                  </form>
                ) : (
                  <Link href="/login" className="w-full block text-center rounded-xl bg-secondary px-4 py-2.5 font-semibold text-secondary-foreground transition hover:bg-secondary/80">
                    Fazer Login para Clonar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
