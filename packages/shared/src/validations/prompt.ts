import { z } from 'zod';

export const PromptVariableSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['string', 'number', 'select']),
  options: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
});

export const CreatePromptSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  content: z.string().min(1),
  model: z.array(z.enum(['chatgpt', 'claude', 'gemini', 'midjourney', 'dall-e', 'flux'])),
  categoryId: z.string().uuid().optional(),
  language: z.enum(['pt-BR', 'en-US', 'en-GB']),
  priceCents: z.number().int().min(0).default(0),
  tags: z.array(z.string().max(50)).default([]),
  variables: z.array(PromptVariableSchema).default([]),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const UpdatePromptSchema = CreatePromptSchema.partial();

export const SearchPromptSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  model: z.string().optional(),
  language: z.string().optional(),
  priceType: z.enum(['free', 'paid', 'all']).optional(),
  sort: z.enum(['relevance', 'downloads', 'rating', 'newest']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
