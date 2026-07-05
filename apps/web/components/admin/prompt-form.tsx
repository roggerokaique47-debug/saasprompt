'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { createPrompt, updatePrompt } from '@/features/admin';
import type { PromptData } from '@prompthub/shared';

interface Category {
  id: string;
  name: string;
}

interface PromptFormProps {
  categories: Category[];
  prompt?: PromptData;
}

export function PromptForm({ categories, prompt }: PromptFormProps) {
  const router = useRouter();
  const isEditing = !!prompt;

  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (isEditing) {
        return updatePrompt(prompt.id, formData);
      }
      return createPrompt(formData);
    },
    null,
  );

  return (
    <>
      {state?.error && (
        <div className="mb-6 rounded-lg bg-error/10 p-3 text-sm text-error">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="mb-6 rounded-lg bg-success/10 p-3 text-sm text-success">
          Prompt {isEditing ? 'atualizado' : 'criado'} com sucesso!
        </div>
      )}

      <form action={formAction} className="max-w-3xl space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Título
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={prompt?.title}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={prompt?.slug}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={prompt?.description ?? ''}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium">
            Conteúdo do Prompt
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            defaultValue={prompt?.content}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
              Categoria
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={prompt?.categoryId ?? ''}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
            >
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="language" className="mb-1 block text-sm font-medium">
              Idioma
            </label>
            <select
              id="language"
              name="language"
              defaultValue={prompt?.language ?? 'pt-BR'}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
            </select>
          </div>

          <div>
            <label htmlFor="priceCents" className="mb-1 block text-sm font-medium">
              Preço (centavos)
            </label>
            <input
              id="priceCents"
              name="priceCents"
              type="number"
              min="0"
              defaultValue={prompt?.priceCents ?? 0}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Modelos AI</label>
          <div className="flex flex-wrap gap-4">
            {['chatgpt', 'claude', 'gemini', 'midjourney', 'dall-e', 'flux'].map(
              (model) => (
                <label key={model} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="model"
                    value={model}
                    defaultChecked={prompt?.model?.includes(model as any)}
                    className="rounded border-border"
                  />
                  <span className="text-sm capitalize">{model}</span>
                </label>
              ),
            )}
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">
            Tags (separadas por vírgula)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={prompt?.tags?.join(', ') ?? ''}
            placeholder="marketing, seo, copywriting"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={prompt?.isPublished}
              className="rounded border-border"
            />
            <span className="text-sm">Publicado</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={prompt?.isFeatured}
              className="rounded border-border"
            />
            <span className="text-sm">Em destaque</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {pending
              ? 'Salvando...'
              : isEditing
                ? 'Atualizar Prompt'
                : 'Criar Prompt'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-border px-6 py-2.5 font-medium hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
