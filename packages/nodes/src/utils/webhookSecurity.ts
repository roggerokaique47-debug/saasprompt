import crypto from 'crypto';

/**
 * Gera a assinatura HMAC SHA256 do payload JSON em conjunto com timestamp e nonce.
 * @param payload Objeto JSON (stringificado) a ser assinado.
 * @param secret Segredo compartilhado (ex: Webhook Secret do cliente).
 * @param timestamp Timestamp da requisição.
 * @param nonce Nonce aleatório da requisição.
 */
export function generateWebhookSignature(payload: string, secret: string, timestamp: string, nonce: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  // O payload a ser assinado é a concatenação com os dados de Replay Protection
  const dataToSign = `${timestamp}.${nonce}.${payload}`;
  return hmac.update(dataToSign).digest('hex');
}

/**
 * Valida a assinatura de um webhook recebido.
 * Previne Replay Attacks limitando o timestamp a 5 minutos (300 segundos).
 */
export function verifyWebhookSignature(
  payload: string, 
  signature: string, 
  secret: string, 
  timestamp: string, 
  nonce: string
): boolean {
  // 1. Replay Protection (Max 5 minutes old)
  const now = Math.floor(Date.now() / 1000);
  const reqTime = parseInt(timestamp, 10);
  
  if (isNaN(reqTime) || Math.abs(now - reqTime) > 300) {
    throw new Error('Webhook timestamp is too old or invalid (Replay Attack Protection)');
  }

  // 2. Validate Signature
  const expectedSignature = generateWebhookSignature(payload, secret, timestamp, nonce);
  
  // Usa timingSafeEqual para prevenir timing attacks
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}
