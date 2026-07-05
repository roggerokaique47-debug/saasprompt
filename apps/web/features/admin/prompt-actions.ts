'use server';

import { revalidatePath } from 'next/cache';
import db from '@prompthub/database/src/client';
import { prompts } from '@prompthub/database/src/schema/prompts';
import { eq } from 'drizzle-orm';

export async function createPrompt(formData: FormData) {
  try {
    const modelValues = formData.getAll('model') as string[];
    const tagsRaw = formData.get('tags') as string;
    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    await db.insert(prompts).values({
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: (formData.get('description') as string) || null,
      content: formData.get('content') as string,
      categoryId: (formData.get('categoryId') as string) || null,
      language: (formData.get('language') as string) || 'pt-BR',
      priceCents: Number(formData.get('priceCents')) || 0,
      model: modelValues.length > 0 ? modelValues : ['chatgpt'],
      tags,
      isPublished: formData.has('isPublished'),
      isFeatured: formData.has('isFeatured'),
    });

    revalidatePath('/admin/prompts');
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function updatePrompt(id: string, formData: FormData) {
  try {
    const modelValues = formData.getAll('model') as string[];
    const tagsRaw = formData.get('tags') as string;
    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    await db
      .update(prompts)
      .set({
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: (formData.get('description') as string) || null,
        content: formData.get('content') as string,
        categoryId: (formData.get('categoryId') as string) || null,
        language: (formData.get('language') as string) || 'pt-BR',
        priceCents: Number(formData.get('priceCents')) || 0,
        model: modelValues.length > 0 ? modelValues : ['chatgpt'],
        tags,
        isPublished: formData.has('isPublished'),
        isFeatured: formData.has('isFeatured'),
      })
      .where(eq(prompts.id, id));

    revalidatePath('/admin/prompts');
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}
