'use server';

import { revalidatePath } from 'next/cache';
import db from '@prompthub/database/src/client';
import { articles } from '@prompthub/database/src/schema/articles';
import { desc, eq } from 'drizzle-orm';
import type { ActionResponse } from '@/types';
import { slugify } from '@/utils';

export async function getArticles() {
  try {
    const allArticles = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));

    return { success: true, data: allArticles };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function createArticle(formData: FormData): Promise<ActionResponse> {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const contentType = formData.get('contentType') as string;
    const isPremium = formData.has('isPremium');
    const priceCents = isPremium ? Number(formData.get('priceCents')) || 0 : 0;
    const isPublished = formData.has('isPublished');

    const slug = slugify(title);

    await db.insert(articles).values({
      title,
      slug,
      content,
      authorId: 'admin',
      contentType,
      isPremium,
      priceCents,
      isPublished,
    });

    revalidatePath('/admin/artigos');
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function updateArticle(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const contentType = formData.get('contentType') as string;
    const isPremium = formData.has('isPremium');
    const priceCents = isPremium ? Number(formData.get('priceCents')) || 0 : 0;
    const isPublished = formData.has('isPublished');

    await db
      .update(articles)
      .set({
        title,
        contentType,
        isPremium,
        priceCents,
        isPublished,
        content,
      })
      .where(eq(articles.id, id));

    revalidatePath('/admin/artigos');
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}

export async function deleteArticle(id: string): Promise<ActionResponse> {
  try {
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath('/admin/artigos');
    return { success: true };
  } catch (error) {
    return { error: String(error) };
  }
}
