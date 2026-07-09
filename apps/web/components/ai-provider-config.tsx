'use client';

import { useState } from 'react';

const PROVIDERS = [
  {
    id: 'openrouter',
    label: 'OpenRouter',
    desc: 'Recomendado: acesso a varios modelos (GPT, Claude, Gemini) com uma unica API. Tem modelo gratis.',
    baseUrl: 'https://openrouter.ai/api/v1',
    keyPlaceholder: 'sk-or-v1-...',
    keyUrl: 'https://openrouter.ai/keys',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    desc: 'API oficial da OpenAI (requer cartao de credito)',
    baseUrl: 'https://api.openai.com/v1',
    keyPlaceholder: 'sk-proj-...',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    desc: 'API oficial da Anthropic para Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    keyPlaceholder: 'sk-ant-...',
    keyUrl: 'https://console.anthropic.com/',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    desc: 'API do Google Gemini (tem free tier generoso)',
    baseUrl: '',
    keyPlaceholder: 'AIza...',
    keyUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'custom',
    label: 'Custom (OpenAI-compativel)',
    desc: 'Qualquer API compativel com OpenAI (Together, Groq, DeepSeek, etc)',
    baseUrl: '',
    keyPlaceholder: 'sk-...',
    keyUrl: '',
  },
];

interface AiProviderConfigProps {
  onConfigured?: () => void;
}

export function AiProviderConfig({ onConfigured }: AiProviderConfigProps) {
  const [selected, setSelected] = useState('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; content?: string; error?: string } | null>(null);

  const currentProvider = PROVIDERS.find((p) => p.id === selected);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selected,
          apiKey,
          model,
          baseUrl: customUrl || currentProvider?.baseUrl || '',
          message: 'Responda apenas "Conexao OK" se voce entendeu.',
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, error: (err as Error).message });
    }

    setTesting(false);
  };

  const handleSaveToEnv = () => {
    const lines = [
      `AI_PROVIDER=${selected}`,
      `AI_API_KEY=${apiKey}`,
      `AI_MODEL=${model}`,
    ];
    if (customUrl || currentProvider?.baseUrl) {
      lines.push(`AI_BASE_URL=${customUrl || currentProvider?.baseUrl}`);
    }

    const content = lines.join('\n');
    navigator.clipboard.writeText(content);
    alert('Configuracao copiada para a area de transferencia! Cole no seu arquivo .env.local');
    onConfigured?.();
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h2 className="mb-4 text-xl font-bold">Configuracao de IA</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Escolha qual provedor de IA usar nas automacoes.
        Voce pode mudar quando quiser.
      </p>

      <div className="mb-6 space-y-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              selected === p.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{p.label}</span>
              {selected === p.id && (
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">
            Chave da API
            {currentProvider?.keyUrl && (
              <a
                href={currentProvider.keyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline"
              >
                (obter chave)
              </a>
            )}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={currentProvider?.keyPlaceholder || 'sk-...'}
            className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">
            Modelo
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4o-mini, claude-3-haiku, gemini-2.0-flash..."
            className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {selected === 'custom' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              URL base da API
            </label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://api.exemplo.com/v1"
              className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleTest}
            disabled={!apiKey || testing}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {testing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
            Testar Conexao
          </button>

          <button
            onClick={handleSaveToEnv}
            disabled={!apiKey}
            className="rounded-lg border border-border px-5 py-3 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
          >
            Copiar Config
          </button>
        </div>

        {result && (
          <div className={`rounded-xl border p-4 ${result.success ? 'border-success bg-success/5' : 'border-error bg-error/5'}`}>
            {result.success ? (
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-semibold text-success">Conectado com sucesso!</p>
                  <p className="mt-1 text-sm text-muted-foreground">{result.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <p className="font-semibold text-error">Falha na conexao</p>
                  <p className="mt-1 text-sm text-muted-foreground">{result.error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
