const postgres = require('postgres');
const sql = postgres('postgresql://postgres:postgres@localhost:54335/prompthub');

async function test() {
  try {
    const res = await sql`select count(*) from workflows where is_published = true`;
    console.log('Success:', res);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}
test();
