'use client';

import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message }),
      });
      
      if (!res.ok) throw new Error('Falha ao enviar.');
      
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-purple-600 hover:bg-purple-700 text-white z-50 p-0 flex items-center justify-center"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col">
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Enviar Feedback</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
          ✕
        </button>
      </div>
      
      <div className="p-4 bg-slate-50">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-green-500 mb-2 flex justify-center"><MessageSquare className="h-8 w-8" /></div>
            <p className="font-medium text-slate-800">Obrigado pelo feedback!</p>
            <p className="text-sm text-slate-500 mt-1">Isso nos ajuda a melhorar a NovaFlow.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Tipo de Feedback</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="general">Sugestão / Geral</option>
                <option value="bug">Reportar um Bug</option>
                <option value="feature_request">Pedir uma Funcionalidade</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
                placeholder="O que você achou da plataforma?"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <Button type="submit" disabled={status === 'loading'} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enviar
            </Button>
            
            {status === 'error' && (
              <p className="text-xs text-red-500 mt-2 text-center">Ocorreu um erro. Tente novamente.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
