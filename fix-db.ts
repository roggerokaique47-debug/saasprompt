import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString);

async function fix() {
  try {
    console.log('Dropping workflows and workflow_categories to force Drizzle recreate...');
    await client`DROP TABLE IF EXISTS workflows CASCADE;`;
    await client`DROP TABLE IF EXISTS workflow_categories CASCADE;`;
    await client`DROP TABLE IF EXISTS executions CASCADE;`;
    await client`DROP TABLE IF EXISTS execution_steps CASCADE;`;
    await client`DROP TABLE IF EXISTS node_logs CASCADE;`;
    console.log('Success!');
  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    await client.end();
  }
}

fix();
