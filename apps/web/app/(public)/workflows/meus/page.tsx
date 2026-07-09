import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserWorkflows } from '@/features/workflows/workflow-actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Meus Workflows',
};

export default async function MeusWorkflowsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const workflows = await getUserWorkflows();

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold">Meus Workflows</h1>
            <p className="text-muted-foreground">{workflows.length} workflow{workflows.length !== 1 ? 's' : ''} criado{workflows.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/workflows/novo"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            + Novo Workflow
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {workflows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white py-20 text-center">
            <div className="mb-4 text-6xl">⚡</div>
            <h2 className="mb-2 text-2xl font-bold">Nenhum workflow ainda</h2>
            <p className="mb-8 text-muted-foreground">
              Crie seu primeiro workflow de automacao com IA agora mesmo.
            </p>
            <Link
              href="/workflows/novo"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              + Criar Workflow
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <Link
                key={wf.id}
                href={`/workflows/${wf.id}`}
                className="group rounded-2xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7]/10 to-[#00CEC9]/10 text-lg">
                    ⚡
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${wf.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {wf.isPublished ? 'Publico' : 'Rascunho'}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                  {wf.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {wf.description || 'Sem descricao'}
                </p>
                <div className="text-xs text-muted-foreground">
                  Atualizado {new Date(wf.updatedAt).toLocaleDateString('pt-BR')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
