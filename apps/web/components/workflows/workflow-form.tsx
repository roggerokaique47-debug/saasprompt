'use client';

import { useActionState, useRef } from 'react';

export function WorkflowForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        const res = await fetch('/api/content/workflows', {
          method: 'POST',
          body: formData,
        });
        return await res.json();
      } catch (e) {
        return { error: String(e) };
      }
    },
    null,
  );

  return (
    <>
      {state?.error && (
        <div className="mb-6 rounded-lg bg-error/10 p-3 text-sm text-error">{state.error}</div>
      )}
      {state?.success && (
        <div className="mb-6 rounded-lg bg-success/10 p-3 text-sm text-success">
          Workflow enviado! Aguarde aprovação.
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">Título</label>
          <input id="title" name="title" required className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Descrição</label>
          <textarea id="description" name="description" rows={3} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
        </div>

        <div>
          <label htmlFor="workflowJson" className="mb-1 block text-sm font-medium">Workflow JSON</label>
          <textarea
            id="workflowJson"
            name="workflowJson"
            required
            rows={15}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 font-mono text-xs outline-none focus:border-primary"
            placeholder='Cole o JSON do workflow n8n aqui...'
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Exporte do n8n: Workflow → Export → JSON
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="n8nVersion" className="mb-1 block text-sm font-medium">Versão n8n</label>
            <input id="n8nVersion" name="n8nVersion" defaultValue="1.0" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
          </div>
          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium">Tags (separadas por vírgula)</label>
            <input id="tags" name="tags" placeholder="automacao, integracao, api" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPremium" className="rounded border-border" />
            <span className="text-sm">Workflow Premium</span>
          </label>
          <div>
            <label htmlFor="priceCents" className="mr-2 text-sm">Preço (centavos)</label>
            <input id="priceCents" name="priceCents" type="number" min="0" defaultValue={0} className="w-28 rounded-lg border border-border bg-white px-3 py-1.5 text-sm outline-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Publicando...' : 'Publicar Workflow'}
        </button>
      </form>
    </>
  );
}
