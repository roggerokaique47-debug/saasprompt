import Redis from 'ioredis';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Helper to ensure idempotency.
 * @param key The idempotency key passed by the client.
 * @param handler The function to execute if this is a new key.
 * @returns The result of the handler.
 */
export async function withIdempotency<T>(key: string | null | undefined, handler: () => Promise<T>): Promise<T> {
  if (!key) {
    return handler();
  }

  const cacheKey = `idempotency:${key}`;
  
  // Verifica se já existe um resultado
  const cached = await redis.get(cacheKey);
  if (cached) {
    if (cached === 'IN_PROGRESS') {
      throw new Error('Concurrent request with same idempotency key is in progress');
    }
    return JSON.parse(cached) as T;
  }

  // Marca como em progresso (24 horas max)
  const setNX = await redis.set(cacheKey, 'IN_PROGRESS', 'EX', 86400, 'NX');
  if (!setNX) {
    throw new Error('Concurrent request with same idempotency key is in progress');
  }

  try {
    const result = await handler();
    // Salva o resultado no Redis
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 86400);
    return result;
  } catch (error) {
    // Se der erro, apagamos a chave para permitir retry, 
    // ou mantemos o erro cacheado. Depende do negócio.
    // O mais seguro para Idempotency-Key 5xx é permitir retry.
    await redis.del(cacheKey);
    throw error;
  }
}
