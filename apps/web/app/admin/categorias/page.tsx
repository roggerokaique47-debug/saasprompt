import type { Metadata } from 'next';
import db from '@prompthub/database/src/client';
import { categories } from '@prompthub/database/src/schema/categories';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { eq, count } from 'drizzle-orm';
import { CategoryForm } from '@/components/admin/category-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Categorias',
};

export default async function AdminCategoriasPage() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.name);

  const promptCounts = await Promise.all(
    allCategories.map(async (cat) => {
      const [result] = await db
        .select({ value: count() })
        .from(prompts)
        .where(eq(prompts.categoryId, cat.id));
      return { id: cat.id, count: result?.value ?? 0 };
    }),
  );

  const countMap = Object.fromEntries(
    promptCounts.map((c) => [c.id, c.count]),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
      </div>

      <div className="mb-8 max-w-md">
        <CategoryForm />
      </div>

      <div className="rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Ãcone</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Prompts</th>
            </tr>
          </thead>
          <tbody>
            {allCategories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-xl">{cat.icon}</td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3">{countMap[cat.id] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

