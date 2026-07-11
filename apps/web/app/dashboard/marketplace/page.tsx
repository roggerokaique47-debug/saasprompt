import Link from 'next/link';
import db from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { eq, desc } from 'drizzle-orm';
import { Search, Star, Download, ShieldCheck, Bot } from 'lucide-react';
import { MarketplaceInstallButton } from './install-button';

const CATEGORIES = ['Todos', 'Atendimento', 'Vendas', 'E-commerce', 'Suporte', 'Analytics', 'Produtividade', 'Marketing'];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < full ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
      ))}
      <span className="ml-1 text-xs text-slate-300">{rating}</span>
    </span>
  );
}

export default async function MarketplacePage() {
  const publishedWorkflows = await db.query.workflows.findMany({
    where: eq(workflows.isPublished, true),
    with: {
      category: true,
      author: true,
    },
    orderBy: [desc(workflows.downloads)],
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-white">Marketplace de Automações</h1>
          <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium border border-[var(--accent)]/30">Beta</span>
        </div>
        <p className="text-slate-400">Instale automações prontas e verificadas. Funciona em segundos.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar automações, integrações, casos de uso..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              cat === 'Todos'
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{publishedWorkflows.length}</p>
          <p className="text-xs text-slate-400">Automações Prontas</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--accent-2)]">
            {publishedWorkflows.reduce((acc, wf) => acc + (wf.downloads || 0), 0)}
          </p>
          <p className="text-xs text-slate-400">Instalações Totais</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {publishedWorkflows.length > 0 
              ? (publishedWorkflows.reduce((acc, wf) => acc + (wf.ratingAvg || 0), 0) / publishedWorkflows.length).toFixed(1)
              : '0.0'}★
          </p>
          <p className="text-xs text-slate-400">Avaliação Média</p>
        </div>
      </div>

      {/* Apps Grid */}
      {publishedWorkflows.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-700 bg-slate-800/50">
          <Bot className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum workflow publicado ainda</h3>
          <p className="text-slate-400 text-sm">Seja o primeiro a publicar uma automação no marketplace!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {publishedWorkflows.map((app) => (
            <div key={app.id} className="group flex flex-col rounded-2xl border border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800 transition-all overflow-hidden shadow-sm hover:shadow-lg hover:shadow-black/20">
              <div className="p-5 flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-blue-500/20 border-blue-500/40 border">
                    {app.category?.icon || '🤖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-sm leading-tight">{app.title}</h3>
                      {app.author?.email?.includes('admin') && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" aria-label="Verificado pela NovaFlow" />
                      )}
                      {app.isPremium && (
                        <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded border border-yellow-500/30">PRO</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{app.category?.name || 'Geral'}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">{app.description || 'Sem descrição.'}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(app.tags || []).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <StarRating rating={app.ratingAvg || 0} />
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Download className="w-3 h-3" />
                      {(app.downloads || 0).toLocaleString('pt-BR')} instalações
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {app.priceCents === 0 ? 'Grátis' : `R$ ${(app.priceCents / 100).toFixed(2)}`}
                  </span>
                </div>
                {/* Botão real conectado ao backend de instalação (Sprint 3) */}
                <MarketplaceInstallButton workflowId={app.id} isPremium={app.isPremium} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Bottom */}
      <div className="mt-10 text-center py-10 rounded-2xl border border-dashed border-slate-700 bg-slate-800/30">
        <p className="text-slate-400 text-sm mb-1">Não encontrou o que procurava?</p>
        <p className="text-white font-medium mb-4">Descreva a automação que você quer e a IA cria para você.</p>
        <Link href="/dashboard/workflows/novo/edit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[#5b4cdb] text-white font-medium transition-colors">
          <Bot className="w-4 h-4" />
          Gerar Automação com IA
        </Link>
      </div>
    </div>
  );
}
