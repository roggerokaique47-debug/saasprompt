import React from 'react';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { workflowTemplates } from '@prompthub/database/src/schema/templates';
import { eq, desc } from 'drizzle-orm';
import { Library, Download, PlayCircle, Plus, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Busca workflows da loja de templates pública
  const publicWorkflows = await db
    .select()
    .from(workflowTemplates)
    .where(eq(workflowTemplates.isPublic, true))
    .orderBy(desc(workflowTemplates.createdAt));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Library className="w-8 h-8 mr-3 text-indigo-500" />
            Biblioteca de Templates
          </h1>
          <p className="text-zinc-400 mt-1">
            Instale fluxos de automação validados pelo mercado com 1 clique.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicWorkflows.length > 0 ? (
          publicWorkflows.map((workflow) => (
            <div key={workflow.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{workflow.name}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                  {workflow.description || 'Nenhuma descrição fornecida.'}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1.5" />
                    {workflow.forkCount} instalações
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1.5" />
                    0
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    0
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/50 flex justify-between items-center">
                <Link 
                  href={`/dashboard/workflows/${workflow.id}`}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Ver detalhes
                </Link>
                <form action={async () => {
                  'use server';
                  // Server Action para clonar o workflow usando route interna
                  const headers = new Headers();
                  headers.append('Content-Type', 'application/json');
                  // Como é server action não precisa chamar rota HTTP, podemos fazer a lógica aqui:
                  const supabaseServer = await createClient();
                  const { data: { user: actionUser } } = await supabaseServer.auth.getUser();
                  if (actionUser) {
                    const { workflows } = await import('@prompthub/database/src/schema/workflows');
                    const { users } = await import('@prompthub/database/src/schema/users');
                    const { sql } = await import('drizzle-orm');

                    const userRows = await db.select().from(users).where(eq(users.id, actionUser.id)).limit(1);
                    if (userRows[0]?.organizationId) {
                      const title = `${workflow.name} (Clone)`;
                      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
                      await db.insert(workflows).values({
                        title,
                        slug,
                        description: workflow.description,
                        workflowJson: workflow.workflowJson,
                        authorId: actionUser.id,
                        organizationId: userRows[0].organizationId,
                        originalTemplateId: workflow.id,
                        isPublished: false,
                      });
                      await db.update(workflowTemplates).set({ forkCount: sql`${workflowTemplates.forkCount} + 1` }).where(eq(workflowTemplates.id, workflow.id));
                    }
                  }
                  redirect('/dashboard/workflows');
                }}>
                  <button type="submit" className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                    <Plus className="w-4 h-4 mr-1" />
                    Instalar
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <Library className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum template disponível</h3>
            <p className="text-zinc-500">Estamos preparando os melhores fluxos para você.</p>
          </div>
        )}
      </div>
    </div>
  );
}
