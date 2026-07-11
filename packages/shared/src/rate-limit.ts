import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Inicializa o Redis apenas se tiver as variáveis de ambiente,
// para evitar quebrar a app localmente se o usuário não configurou Upstash.
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/**
 * Cria ou recupera um Rate Limiter baseado em tokens.
 * Por padrão, usa Sliding Window (mais preciso para APIs).
 *
 * @param requests Limit of requests (e.g. 100)
 * @param window Window size (e.g. '1 m' or '10 s')
 */
export function getRateLimiter(requests: number, window: '10 s' | '1 m' | '5 m' | '15 m') {
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
  });
}

/**
 * Verifica o rate limit para um identificador.
 * @param identifier IP do usuário, ID da sessão ou ID do Workflow
 * @param requests Número de requests
 * @param window Janela de tempo
 * @returns { success: boolean, remaining?: number }
 */
export async function checkRateLimit(
  identifier: string,
  requests: number = 10,
  window: '1 m' | '10 s' = '1 m'
): Promise<{ success: boolean; remaining?: number }> {
  // Bypassa se o redis não estiver configurado (desenvolvimento / fallback)
  if (!redis) {
    return { success: true };
  }

  const limiter = getRateLimiter(requests, window);
  if (!limiter) {
    return { success: true };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
    };
  } catch (error) {
    console.error('Rate Limit Error:', error);
    // Em caso de falha no Redis, permitimos a request para não derrubar a aplicação toda
    return { success: true };
  }
}
