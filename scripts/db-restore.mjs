#!/usr/bin/env node
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Parâmetros de ambiente
const DB_URL = process.env.DATABASE_URL;
const ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || 'default-secret-key-must-be-32-chars!'.padEnd(32, 'x'); // Exija 32 chars
const BACKUP_FILE = process.argv[2];

if (!DB_URL) {
  console.error("❌ DATABASE_URL is missing!");
  process.exit(1);
}

if (!BACKUP_FILE || !fs.existsSync(BACKUP_FILE)) {
  console.error("❌ Caminho do arquivo de backup (encriptado) não fornecido ou não existe!");
  console.log("Uso: node scripts/db-restore.mjs ./backups/backup-2026-07-11.sql.enc");
  process.exit(1);
}

try {
  console.log(`[Restore] Descriptografando (AES-256-GCM)...`);
  const fileBuffer = fs.readFileSync(BACKUP_FILE);
  
  // Extrair partes
  const iv = fileBuffer.subarray(0, 16);
  const authTag = fileBuffer.subarray(16, 32);
  const encrypted = fileBuffer.subarray(32);

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  
  const decryptedPath = BACKUP_FILE.replace('.enc', '.decrypted.sql');
  fs.writeFileSync(decryptedPath, decrypted);
  console.log(`[Restore] Arquivo descriptografado em: ${decryptedPath}`);

  console.log(`[Restore] Iniciando psql para restauração em ${DB_URL}...`);
  // CUIDADO: Isso sobrescreverá/adicionará ao banco atual!
  execSync(`psql "${DB_URL}" < "${decryptedPath}"`);
  console.log(`✅ Banco de dados restaurado com sucesso!`);

  // Limpar descriptografado
  fs.unlinkSync(decryptedPath);

} catch (error) {
  console.error("❌ Erro no processo de Restore:", error);
  process.exit(1);
}
