'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type Role = 'admin' | 'editor' | 'viewer';

export function InviteMemberForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('editor');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setState('loading');
    setMessage('');

    try {
      const res = await fetch('/api/organizations/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao enviar convite.');
      }

      setState('success');
      setMessage(`Convite enviado para ${email}.`);
      setEmail('');
    } catch (err: any) {
      setState('error');
      setMessage(err.message);
      setTimeout(() => {
        setState('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@empresa.com"
        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors text-sm"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-[var(--accent)] text-sm"
      >
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        disabled={state === 'loading' || state === 'success'}
        className="px-5 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[#5b4cdb] disabled:opacity-60 text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        {state === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : state === 'success' ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {state === 'loading' ? 'Enviando...' : state === 'success' ? 'Enviado!' : 'Enviar Convite'}
      </button>

      {message && (
        <div className={`mt-2 text-xs flex items-center gap-1.5 sm:col-span-3 ${state === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
          {state === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {message}
        </div>
      )}
    </form>
  );
}
