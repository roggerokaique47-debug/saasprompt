import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

config({ path: resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not found');

const sql = postgres(connectionString);

async function run() {
  try {
    console.log('Adding custom_ai_key to users...');
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_ai_key text;`;
    
    console.log('Creating usage_logs table...');
    await sql`
      CREATE TABLE IF NOT EXISTS usage_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action text NOT NULL,
        tokens_spent integer NOT NULL DEFAULT 0,
        key_type text NOT NULL DEFAULT 'system',
        created_at timestamp NOT NULL DEFAULT now()
      );
    `;
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

run();
