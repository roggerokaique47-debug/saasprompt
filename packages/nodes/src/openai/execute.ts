import { NodeType, NodeExecutor } from '../types';
import { callChatCompletion } from './ai-provider';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq, and, inArray } from 'drizzle-orm';
import { decryptText } from '@prompthub/shared';

export const executeOpenAI: NodeExecutor = {
  type: NodeType.OPENAI,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId not provided in context');
    }

    const prompt = (config.prompt as string) || (typeof input === 'string' ? input : JSON.stringify(input)) || '';
    const model = config.model as string;

    // Check if the organization has an AI credential
    const existing = await db
      .select()
      .from(credentials)
      .where(
        and(
          eq(credentials.organizationId, context.organizationId),
          inArray(credentials.provider, ['openai', 'openrouter', 'anthropic', 'gemini'])
        )
      )
      .limit(1);

    let overrides = undefined;
    
    if (existing.length > 0 && existing[0].accessToken) {
      const decryptedKey = decryptText(existing[0].accessToken);
      if (decryptedKey) {
        overrides = {
          provider: existing[0].provider as any,
          apiKey: decryptedKey,
        };
      }
    }

    // fallback para provider global via .env se overrides for undefined e env_vars estiverem configuradas
    const result = await callChatCompletion(
      [{ role: 'user', content: prompt }],
      { ...overrides, ...(model ? { model } : {}) }
    );

    return {
      model: result.model,
      provider: result.provider,
      prompt,
      response: result.content,
      usage: result.usage,
    };
  },
};
