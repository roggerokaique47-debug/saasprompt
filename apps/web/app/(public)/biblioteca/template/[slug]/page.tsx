import { notFound } from 'next/navigation';
import db from '@prompthub/database/src/client';
import { workflows, workflowCategories } from '@prompthub/database/src/schema/workflows';
import { users } from '@prompthub/database/src/schema/users';
import { eq, sql } from 'drizzle-orm';
import { Star, Download, Play, CheckCircle2, ChevronRight, Share2, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CloneButton } from './clone-button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Busca o workflow, autor e categoria
  const [workflow] = await db
    .select({
      workflow: workflows,
      author: {
        name: users.name,
        avatar: users.avatarUrl,
      },
      category: {
        name: workflowCategories.name,
        icon: workflowCategories.icon,
      }
    })
    .from(workflows)
    .where(eq(workflows.slug, slug))
    .leftJoin(users, eq(workflows.authorId, users.id))
    .leftJoin(workflowCategories, eq(workflows.categoryId, workflowCategories.id))
    .limit(1);

  if (!workflow) {
    notFound();
  }

  // Atualiza as views de forma assíncrona (nao bloqueia a renderização)
  db.update(workflows)
    .set({ views: sql`${workflows.views} + 1` })
    .where(eq(workflows.id, workflow.workflow.id))
    .execute();

  const w = workflow.workflow;
  const nodesCount = w.workflowJson && typeof w.workflowJson === 'object' && 'nodes' in (w.workflowJson as any) 
    ? ((w.workflowJson as any).nodes as any[]).length 
    : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/biblioteca" className="hover:text-purple-600 transition-colors">Marketplace</Link>
        <ChevronRight className="h-4 w-4" />
        {workflow.category?.name && (
          <>
            <Link href={`/biblioteca?categoria=${w.categoryId}`} className="hover:text-purple-600 transition-colors">
              {workflow.category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="truncate text-slate-900 font-medium">{w.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Content (Title, Info, Flow Preview) */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{w.title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              {w.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold overflow-hidden">
                  {workflow.author?.avatar ? (
                    <img src={workflow.author.avatar} alt="Author" className="w-full h-full object-cover" />
                  ) : (
                    workflow.author?.name?.charAt(0) || 'U'
                  )}
                </div>
                <span className="font-medium text-slate-700">{workflow.author?.name || 'Comunidade NovaFlow'}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                {Number(w.ratingAvg).toFixed(1)}
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Download className="h-4 w-4" />
                {w.downloads} instalações
              </div>
            </div>
          </div>

          {/* Tags / Integrations */}
          {w.tags && w.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Apps Integrados</h3>
              <div className="flex flex-wrap gap-2">
                {w.tags.map((tag) => (
                  <span key={tag} className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Structure Preview */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Play className="h-4 w-4 text-purple-600" />
                Estrutura do Fluxo
              </h3>
              <span className="text-sm text-slate-500">{nodesCount} blocos de automação</span>
            </div>
            <div className="p-6">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm rotate-3">
                  <Play className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-medium text-slate-900 mb-2">Visão Estrutural Oculta</h4>
                <p className="text-slate-500 max-w-sm mb-6">
                  Instale este template gratuitamente na sua conta para abrir o Editor Visual e explorar como os {nodesCount} blocos estão conectados.
                </p>
                <CloneButton workflowId={w.id} variant="outline" />
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Avaliações ({w.ratingAvg})</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Deixar Review
              </Button>
            </div>
            {/* TODO: List Reviews Here */}
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              Nenhuma avaliação por escrito ainda. Seja o primeiro a instalar e testar!
            </div>
          </div>
        </div>

        {/* Right Sidebar (Action Panel) */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
            <div className="mb-6">
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Instalação</div>
              <div className="text-3xl font-bold text-slate-900">
                {w.isPremium ? (
                  <>R$ {(w.priceCents / 100).toFixed(2)}</>
                ) : (
                  <span className="text-green-600">Grátis</span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Instalação instantânea no seu painel.
              </p>
            </div>

            <CloneButton workflowId={w.id} className="w-full h-12 text-base font-semibold shadow-md" />

            <div className="mt-6 space-y-4 text-sm text-slate-600 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Integração 1-Clique</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>100% Customizável</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Custa em média 2-5 tokens/execução</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
              <Button variant="ghost" className="text-slate-500 w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar Template
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
