import React from 'react';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { agents } from '@prompthub/database/src/schema/agents';
import { eq, desc } from 'drizzle-orm';
import { Briefcase, Download, Bot, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AgentesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Busca os agentes (Funcionários de IA) disponíveis
  const publicAgents = await db
    .select()
    .from(agents)
    .where(eq(agents.isPublished, true))
    .orderBy(desc(agents.downloads));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-cyan-500" />
            Funcionários de IA
          </h1>
          <p className="text-zinc-400 mt-1">
            Contrate personas de Inteligência Artificial para atuar no seu negócio. Eles atendem no WhatsApp baseados no seu RAG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicAgents.length > 0 ? (
          publicAgents.map((agent) => (
            <div key={agent.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Bot className="h-6 w-6" />
                  </div>
                  {agent.isPremium && (
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold rounded-full flex items-center gap-1">
                      Premium
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{agent.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                  {agent.description || 'Nenhuma descrição fornecida.'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-xs text-zinc-500 mt-auto">
                  <Download className="w-4 h-4 mr-1.5" />
                  {agent.downloads} contratações
                </div>
              </div>
              
              <div className="p-4 border-t border-zinc-800/50 bg-zinc-950/50 flex justify-between items-center">
                <Link 
                  href={`/dashboard/agentes/${agent.id}`}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Ver Perfil
                </Link>
                <form action={async () => {
                  'use server';
                  // Server Action para contratar agente
                  const supabaseServer = await createClient();
                  const { data: { user } } = await supabaseServer.auth.getUser();
                  if (user) {
                    const clone = { ...agent, id: undefined, authorId: user.id, isPublished: false, downloads: 0, title: `${agent.title} (Ativo)` };
                    await db.insert(agents).values(clone as any);
                    await db.update(agents).set({ downloads: agent.downloads + 1 }).where(eq(agents.id, agent.id));
                  }
                }}>
                  <button type="submit" className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contratar
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum Funcionário Disponível</h3>
            <p className="text-zinc-500">Estamos treinando nossos primeiros agentes de IA.</p>
          </div>
        )}
      </div>
    </div>
  );
}
