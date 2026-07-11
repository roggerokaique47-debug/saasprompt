import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);

async function fix() {
  try {
    console.log('Dropping schema public cascade...');
    await client`DROP SCHEMA public CASCADE;`;
    await client`CREATE SCHEMA public;`;
    await client`GRANT ALL ON SCHEMA public TO postgres;`;
    await client`GRANT ALL ON SCHEMA public TO public;`;
    console.log('Success! Schema public recreated.');
  } catch (error) {
    console.error('Error modifying database:', error);
  } finally {
    await client.end();
  }
}

fix();
