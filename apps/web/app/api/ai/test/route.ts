import { NextResponse } from 'next/server';
import { callChatCompletion, getActiveProvider, registerProvider } from '@prompthub/engine';

export async function POST(req: Request) {
  const body = await req.json();
  const { provider, apiKey, model, baseUrl, message } = body;

  if (provider && apiKey) {
    registerProvider('test', {
      provider: provider as 'openai' | 'openrouter' | 'anthropic' | 'gemini' | 'custom',
      apiKey,
      model: model || 'gpt-4o-mini',
      baseUrl: baseUrl || '',
      label: provider.toUpperCase(),
    });
  }

  try {
    const result = await callChatCompletion(
      [{ role: 'user', content: message || 'Diga "Conexao OK" em portugues.' }],
      provider && apiKey ? { provider: provider as never, apiKey, model: model || 'gpt-4o-mini', baseUrl: baseUrl || '', label: '' } : undefined,
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      provider: getActiveProvider(),
    }, { status: 400 });
  }
}

export async function GET() {
  const active = getActiveProvider();
  return NextResponse.json({
    configured: !!active.apiKey,
    provider: active.provider,
    model: active.model,
    hasKey: !!active.apiKey,
  });
}
