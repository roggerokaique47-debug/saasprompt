import { describe, it, expect, vi, beforeEach } from 'vitest';
import RedisMock from 'ioredis-mock';
import { withIdempotency } from '../idempotency';

// Mock do ioredis para usar o ioredis-mock
vi.mock('ioredis', () => {
  return {
    default: RedisMock
  };
});

describe('idempotency', () => {
  it('deve executar o handler normalmente quando não há chave', async () => {
    const handler = vi.fn().mockResolvedValue('resultado');
    const result = await withIdempotency(null, handler);
    
    expect(handler).toHaveBeenCalledOnce();
    expect(result).toBe('resultado');
  });

  it('deve executar o handler e armazenar no cache na primeira requisição', async () => {
    const handler = vi.fn().mockResolvedValue('resultado-novo');
    const result = await withIdempotency('key1', handler);
    
    expect(handler).toHaveBeenCalledOnce();
    expect(result).toBe('resultado-novo');
  });

  it('deve retornar do cache na segunda requisição com a mesma chave', async () => {
    let callCount = 0;
    const handler = vi.fn(async () => {
      callCount++;
      return 'resultado-cacheado';
    });

    // Primeira vez
    await withIdempotency('key2', handler);
    // Segunda vez
    const result2 = await withIdempotency('key2', handler);

    expect(callCount).toBe(1);
    expect(result2).toBe('resultado-cacheado');
  });

  it('deve retornar erro de concorrência quando a requisição estiver IN_PROGRESS', async () => {
    const handler = vi.fn(async () => {
      return new Promise(resolve => setTimeout(() => resolve('demorou'), 100));
    });

    // Inicia a primeira requisição (não espera concluir)
    const p1 = withIdempotency('key3', handler);
    
    // Tenta a segunda requisição imediatamente
    const p2 = withIdempotency('key3', handler);
    
    await expect(p2).rejects.toThrow('Concurrent request with same idempotency key is in progress');
    await p1; // espera terminar a primeira
  });
});
