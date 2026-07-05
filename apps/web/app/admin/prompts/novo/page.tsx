import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { categories } from '@prompthub/database/src/schema/categories';
import { PromptForm } from '@/features/admin/prompt-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novo Prompt',
};

export default async function NovoPromptPage() {
  const allCategories = await db.select().from(categories);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Novo Prompt</h1>
      <PromptForm categories={allCategories} />
    </div>
  );
}

