'use client';

import { useActionState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface ArticleFormProps {
  categories: Category[];
}

export function ArticleForm({ categories }: ArticleFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      try {
        const res = await fetch('/api/content/articles', {
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
          Artigo criado! Aguarde aprovação.
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">Título</label>
          <input id="title" name="title" required className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Descrição curta</label>
          <textarea id="description" name="description" rows={2} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium">Conteúdo (Markdown)</label>
          <textarea id="content" name="content" required rows={20} className="w-full rounded-lg border border-border bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-primary" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">Categoria</label>
            <select id="categoryId" name="categoryId" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary">
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contentType" className="mb-1 block text-sm font-medium">Tipo</label>
            <select id="contentType" name="contentType" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary">
              <option value="tutorial">Tutorial</option>
              <option value="guide">Guia</option>
              <option value="documentation">Documentação</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">Tags (separadas por vírgula)</label>
          <input id="tags" name="tags" placeholder="n8n, automacao, integracao" className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary" />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPremium" className="rounded border-border" />
            <span className="text-sm">Conteúdo Premium</span>
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
          {pending ? 'Publicando...' : 'Publicar Artigo'}
        </button>
      </form>
    </>
  );
}
