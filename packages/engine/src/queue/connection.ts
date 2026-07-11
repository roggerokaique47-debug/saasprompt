import Redis from 'ioredis';

// Cria a conexão com Redis.
// Se falhar de primeira, ele continuará tentando (com backoff interno do ioredis).
export const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Recomendado para o BullMQ
});

connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});
