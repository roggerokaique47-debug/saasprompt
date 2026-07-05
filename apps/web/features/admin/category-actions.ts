'use server';

import { revalidatePath } from 'next/cache';
import db from '@prompthub/database/src/client';
import { categories } from '@prompthub/database/src/schema/categories';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;

    await db.insert(categories).values({
      name,
      slug: slugify(name),
      icon: icon || null,
    });

    revalidatePath('/admin/categorias');
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}
