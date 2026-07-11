import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserWorkflows } from '@/features/workflows/workflow-actions';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, Clock, Play, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function WorkflowsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const workflows = await getUserWorkflows();

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Meus Workflows</h1>
          <p className="text-slate-400">Crie, gerencie e acompanhe o desempenho das suas automações.</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/dashboard/templates">
            <Button variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Templates
            </Button>
          </Link>
          <Link href="/dashboard/workflows/novo/edit">
            <Button className="bg-[var(--accent)] hover:bg-[#5b4cdb] text-white border-none">
              <Plus className="w-4 h-4 mr-2" />
              Novo Workflow
            </Button>
          </Link>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-700 bg-slate-800/50">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Nenhum workflow encontrado</h2>
          <p className="text-slate-400 max-w-md mb-6">Você ainda não criou nenhuma automação. Comece do zero ou utilize um dos nossos templates prontos.</p>
          <Link href="/dashboard/workflows/novo/edit">
            <Button className="bg-[var(--accent)] hover:bg-[#5b4cdb] text-white">
              Criar o Primeiro Workflow
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((wf) => (
            <div key={wf.id} className="group flex flex-col rounded-xl border border-slate-700 bg-slate-800 hover:border-slate-600 transition-all overflow-hidden">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${wf.isPublished ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                    {wf.isPublished ? 'Ativo' : 'Rascunho'}
                  </div>
                </div>
                
                <Link href={`/dashboard/workflows/${wf.id}/edit`} className="block">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate hover:text-[var(--accent-2)] transition-colors" title={wf.title}>{wf.title}</h3>
                </Link>
                
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {wf.description || 'Automação criada com NovaFlow AI.'}
                </p>
              </div>
              
              <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {wf.updatedAt ? formatDistanceToNow(new Date(wf.updatedAt), { addSuffix: true, locale: ptBR }) : 'Recentemente'}
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/dashboard/workflows/${wf.id}/edit`} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Editar">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                  <button className="p-1.5 rounded-md hover:bg-emerald-500/20 text-emerald-400 transition-colors" title="Executar">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
