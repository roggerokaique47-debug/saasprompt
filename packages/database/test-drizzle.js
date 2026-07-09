const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const { pgTable, uuid, boolean, integer, text, timestamp, jsonb } = require('drizzle-orm/pg-core');
const { sql, count, and, eq } = require('drizzle-orm');

const workflows = pgTable('workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  isPublished: boolean('is_published').default(false).notNull(),
  tags: text('tags').array().notNull().default(sql`'{}'`),
});

const client = postgres('postgresql://postgres:postgres@localhost:54335/prompthub');
const db = drizzle(client);

async function run() {
  try {
    const conditions = [eq(workflows.isPublished, true)];
    
    console.log('Running query 1...');
    const totalResult = await db.select({ total: count() }).from(workflows).where(and(...conditions));
    console.log('totalResult', totalResult);
    
    console.log('Running query 2...');
    const allWorkflows = await db.select().from(workflows).where(and(...conditions)).limit(10).offset(0);
    console.log('allWorkflows length', allWorkflows.length);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
