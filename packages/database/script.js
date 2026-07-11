const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'workflows'`.then(res => {
  console.log(res.map(r => r.column_name));
  process.exit(0);
});
