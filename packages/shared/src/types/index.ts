export type PlanType = 'free' | 'pro' | 'team';

export type Locale = 'pt-BR' | 'en-US' | 'en-GB';

export type AITool = 'chatgpt' | 'claude' | 'gemini' | 'midjourney' | 'dall-e' | 'flux';

export interface PromptFile {
  id: string;
  format: 'pdf' | 'md' | 'txt';
  url: string;
  sizeBytes: number;
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'select';
  options?: string[];
  description?: string;
}

export interface PromptData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  model: AITool[];
  categoryId: string | null;
  authorId: string | null;
  language: Locale;
  priceCents: number;
  downloads: number;
  views: number;
  ratingAvg: number;
  ratingCount: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  variables: PromptVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  locale: Locale;
  plan: PlanType;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  model?: AITool;
  language?: Locale;
  priceType?: 'free' | 'paid' | 'all';
  sort?: 'relevance' | 'downloads' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  prompts: PromptData[];
  total: number;
  page: number;
  totalPages: number;
}
