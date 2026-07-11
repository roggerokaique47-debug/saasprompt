'use client';

import { useState } from 'react';
import { Globe, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PublishToggleProps {
  workflowId: string;
  isPublished: boolean;
}

export function WorkflowPublishToggle({ workflowId, isPublished: initialState }: PublishToggleProps) {
  const [published, setPublished] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/workflows/${workflowId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !published }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao atualizar publicação.');
      }

      setPublished(!published);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
          published
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-[var(--accent)] hover:text-[var(--accent)]'
        } disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : published ? (
          <Globe className="w-4 h-4" />
        ) : (
          <Lock className="w-4 h-4" />
        )}
        {loading ? 'Atualizando...' : published ? 'Publicado no Marketplace' : 'Publicar no Marketplace'}
      </button>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
