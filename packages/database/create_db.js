const postgres = require('postgres');
const sql = postgres('postgresql://postgres:postgres@localhost:54335/postgres');
async function main() {
  const dbs = await sql`SELECT datname FROM pg_database`;
  console.log('Databases:', dbs.map(d => d.datname));
  
  if (!dbs.find(d => d.datname === 'prompthub')) {
    console.log('Creating database prompthub...');
    await sql`CREATE DATABASE prompthub`;
    console.log('Database prompthub created!');
  } else {
    console.log('Database prompthub already exists.');
  }
  await sql.end();
}
main().catch(console.error);
