import { describe, it, expect, vi } from 'vitest';
import { generateWebhookSignature, verifyWebhookSignature } from '../webhookSecurity';

describe('webhookSecurity', () => {
  const secret = 'test-secret';
  const payload = JSON.stringify({ event: 'ping' });
  const nonce = 'random-nonce-123';

  it('deve gerar uma assinatura válida e conseguir verificá-la', () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = generateWebhookSignature(payload, secret, timestamp, nonce);

    const isValid = verifyWebhookSignature(payload, signature, secret, timestamp, nonce);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar uma assinatura inválida', () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const isValid = verifyWebhookSignature(payload, 'invalid-sig', secret, timestamp, nonce);
    expect(isValid).toBe(false);
  });

  it('deve prevenir Replay Attacks (timestamp > 5 min)', () => {
    // Simulando request muito antiga (6 minutos)
    const timestamp = Math.floor(Date.now() / 1000 - 360).toString();
    const signature = generateWebhookSignature(payload, secret, timestamp, nonce);

    expect(() => {
      verifyWebhookSignature(payload, signature, secret, timestamp, nonce);
    }).toThrow(/Replay Attack/);
  });
});
