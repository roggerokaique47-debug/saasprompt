'use server';

import { revalidatePath } from 'next/cache';
import db from '@prompthub/database/src/client';
import { categories } from '@prompthub/database/src/schema/categories';
import { slugify } from '@/utils';
import type { ActionResponse } from '@/types';

export async function createCategory(formData: FormData): Promise<ActionResponse> {
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
