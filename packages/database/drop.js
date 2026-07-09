const postgres = require('postgres');
const sql = postgres('postgresql://postgres:postgres@localhost:54335/prompthub');
async function main() {
  await sql.unsafe('drop schema public cascade; create schema public;');
  console.log('Schema dropped and recreated');
  await sql.end();
}
main().catch(console.error);
