#!/usr/bin/env node
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Parâmetros de ambiente
const DB_URL = process.env.DATABASE_URL;
const ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || 'default-secret-key-must-be-32-chars!'.padEnd(32, 'x'); // Exija 32 chars
const S3_BUCKET = process.env.AWS_S3_BUCKET;

if (!DB_URL) {
  console.error("❌ DATABASE_URL is missing!");
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const dumpFileName = `backup-${timestamp}.sql`;
const encryptedFileName = `${dumpFileName}.enc`;
const backupsDir = path.join(process.cwd(), 'backups');

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
}

const dumpPath = path.join(backupsDir, dumpFileName);
const encryptedPath = path.join(backupsDir, encryptedFileName);

try {
  console.log(`[Backup] Iniciando pg_dump para ${dumpPath}...`);
  // Executar pg_dump (requer postgresql-client instalado no worker/máquina)
  execSync(`pg_dump "${DB_URL}" > "${dumpPath}"`);
  console.log(`[Backup] Dump concluído com sucesso.`);

  console.log(`[Backup] Criptografando (AES-256-GCM)...`);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  
  const input = fs.readFileSync(dumpPath);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Guardar iv + authTag + encrypted no mesmo arquivo
  fs.writeFileSync(encryptedPath, Buffer.concat([iv, authTag, encrypted]));
  console.log(`[Backup] Criptografia concluída: ${encryptedPath}`);

  // Limpar arquivo raw por segurança
  fs.unlinkSync(dumpPath);

  // Aqui entraria o upload pro S3 se AWS SDK estiver configurado
  if (S3_BUCKET) {
    console.log(`[Backup] (Simulado) Fazendo upload para s3://${S3_BUCKET}/${encryptedFileName}`);
    // s3.putObject(...)
  }

  console.log(`✅ Backup Atômico e Criptografado gerado com sucesso!`);
} catch (error) {
  console.error("❌ Erro no processo de Backup/Disaster Recovery:", error);
  process.exit(1);
}
