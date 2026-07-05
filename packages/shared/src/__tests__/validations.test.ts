import { describe, it, expect } from 'vitest';
import { CreatePromptSchema, SearchPromptSchema, SignUpSchema } from '../validations/index.js';

describe('CreatePromptSchema', () => {
  it('accepts valid prompt data', () => {
    const result = CreatePromptSchema.safeParse({
      title: 'Test Prompt',
      slug: 'test-prompt',
      content: 'You are a helpful assistant...',
      model: ['chatgpt', 'claude'],
      language: 'pt-BR',
      priceCents: 0,
      tags: ['test'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects short title', () => {
    const result = CreatePromptSchema.safeParse({
      title: 'AB',
      content: 'test',
      model: ['chatgpt'],
      language: 'pt-BR',
    });
    expect(result.success).toBe(false);
  });
});

describe('SearchPromptSchema', () => {
  it('applies default values', () => {
    const result = SearchPromptSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});

describe('SignUpSchema', () => {
  it('accepts valid signup', () => {
    const result = SignUpSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = SignUpSchema.safeParse({
      email: 'test@example.com',
      password: '123',
      name: 'Test',
    });
    expect(result.success).toBe(false);
  });
});
