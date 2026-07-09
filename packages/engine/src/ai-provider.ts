export type AIProviderType = 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom';

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey: string;
  baseUrl?: string;
  model: string;
  label: string;
}

const PROVIDER_REGISTRY: Record<string, AIProviderConfig> = {};

export function registerProvider(name: string, config: AIProviderConfig) {
  PROVIDER_REGISTRY[name] = config;
}

export function getProvider(name: string): AIProviderConfig | undefined {
  return PROVIDER_REGISTRY[name];
}

export function getActiveProvider(): AIProviderConfig {
  if (Object.keys(PROVIDER_REGISTRY).length > 0) {
    const first = Object.values(PROVIDER_REGISTRY)[0];
    if (first) return first;
  }

  const envProvider = (process.env.AI_PROVIDER || 'openrouter') as AIProviderType;
  const envKey = process.env.AI_API_KEY || '';
  const envModel = process.env.AI_MODEL || 'gpt-4o-mini';
  const envBaseUrl = process.env.AI_BASE_URL || '';

  return {
    provider: envProvider,
    apiKey: envKey,
    baseUrl: envBaseUrl,
    model: envModel,
    label: envProvider.toUpperCase(),
  };
}

const DEFAULT_BASE_URLS: Record<AIProviderType, string> = {
  openai: 'https://api.openai.com/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  anthropic: 'https://api.anthropic.com/v1',
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  custom: '',
};

export async function callChatCompletion(
  messages: { role: string; content: string }[],
  overrides?: Partial<AIProviderConfig>,
) {
  const config = { ...getActiveProvider(), ...overrides };
  if (!config.apiKey) throw new Error('Nenhuma chave de API configurada. Configure AI_API_KEY no .env.local');

  const baseUrl = config.baseUrl || DEFAULT_BASE_URLS[config.provider] || DEFAULT_BASE_URLS.openrouter;

  if (config.provider === 'anthropic') {
    return callAnthropic(messages, config);
  }

  if (config.provider === 'gemini') {
    return callGemini(messages, config);
  }

  return callOpenAICompatible(messages, config, baseUrl);
}

async function callOpenAICompatible(
  messages: { role: string; content: string }[],
  config: AIProviderConfig,
  baseUrl: string,
) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      ...(config.provider === 'openrouter' ? {
        'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
        'X-Title': 'NovaFlow AI',
      } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: 'You are a helpful automation assistant.' },
        ...messages,
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${config.provider}): ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    model: config.model,
    provider: config.provider,
    content: data.choices?.[0]?.message?.content || '',
    usage: data.usage || {},
  };
}

async function callAnthropic(
  messages: { role: string; content: string }[],
  config: AIProviderConfig,
) {
  const systemMsg = messages.find((m) => m.role === 'system');
  const userMsgs = messages.filter((m) => m.role !== 'system');

  const response = await fetch(`${DEFAULT_BASE_URLS.anthropic}/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-haiku-20240307',
      system: systemMsg?.content || 'You are a helpful automation assistant.',
      messages: userMsgs.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    model: config.model,
    provider: 'anthropic',
    content: data.content?.[0]?.text || '',
    usage: data.usage || {},
  };
}

async function callGemini(
  messages: { role: string; content: string }[],
  config: AIProviderConfig,
) {
  const systemMsg = messages.find((m) => m.role === 'system');
  const userMsgs = messages.filter((m) => m.role !== 'system');

  const contents = userMsgs.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `${DEFAULT_BASE_URLS.gemini}/models/${config.model || 'gemini-2.0-flash'}:generateContent?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemMsg ? {
          parts: [{ text: systemMsg.content }],
        } : undefined,
        contents,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    model: config.model,
    provider: 'gemini',
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    usage: data.usageMetadata || {},
  };
}

export function initEnvProvider() {
  const provider = process.env.AI_PROVIDER as AIProviderType | undefined;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const baseUrl = process.env.AI_BASE_URL;

  if (!provider || !apiKey) return;

  registerProvider('default', {
    provider,
    apiKey,
    model: model || 'gpt-4o-mini',
    baseUrl: baseUrl || '',
    label: provider.toUpperCase(),
  });
}
