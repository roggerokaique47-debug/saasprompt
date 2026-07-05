'use client';

import { useActionState } from 'react';
import { createCategory } from '@/features/admin';

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => createCategory(formData),
    null,
  );

  return (
    <>
      {state?.error && (
        <div className="mb-4 rounded-lg bg-error/10 p-3 text-sm text-error">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">
          Categoria criada!
        </div>
      )}

      <form action={formAction} className="flex gap-3">
        <input
          name="name"
          placeholder="Nome da categoria"
          required
          className="flex-1 rounded-lg border border-border bg-white px-4 py-2 outline-none focus:border-primary"
        />
        <input
          name="icon"
          placeholder="Ícone (emoji)"
          maxLength={2}
          className="w-16 rounded-lg border border-border bg-white px-4 py-2 text-center outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending ? '...' : 'Adicionar'}
        </button>
      </form>
    </>
  );
}
