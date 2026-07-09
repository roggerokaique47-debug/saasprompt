import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { categories } from '@prompthub/database/src/schema/categories';
import { PromptForm } from '@/features/admin/prompt-form';

export const metadata: Metadata = {
  title: 'Editar Prompt',
};

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.id, id))
    .limit(1);

  if (!prompt) notFound();

  const allCategories = await db.select().from(categories);

  const promptData = {
    ...prompt,
    ratingAvg: Number(prompt.ratingAvg),
  };

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Editar Prompt</h1>
      <PromptForm categories={allCategories} prompt={promptData as any} />
    </div>
  );
}
