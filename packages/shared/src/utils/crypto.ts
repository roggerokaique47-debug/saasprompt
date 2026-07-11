import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Retorna a chave de criptografia a partir da variável de ambiente ENCRYPTION_KEY.
 * Em produção, ela deve ter exatamente 32 bytes (256 bits).
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables.');
  }
  
  const keyBuffer = Buffer.from(key, 'utf-8');
  if (keyBuffer.length !== 32) {
    // Para simplificar o dev local, se a chave não for 32 bytes, usamos um hash
    return crypto.createHash('sha256').update(key).digest();
  }
  return keyBuffer;
}

/**
 * Criptografa um texto usando AES-256-GCM.
 * O formato de saída é iv:authTag:encryptedText em Base64.
 */
export function encryptText(text: string): string {
  if (!text) return '';

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Descriptografa um texto que foi encriptado com encryptText (AES-256-GCM).
 */
export function decryptText(encryptedData: string): string {
  if (!encryptedData) return '';
  
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Formato de dado criptografado inválido.');
  }
  
  const [ivBase64, authTagBase64, encryptedText] = parts;
  
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  const key = getEncryptionKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
