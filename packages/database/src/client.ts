import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

let db: ReturnType<typeof drizzle>;

function thenable<T>(val: T): T & Promise<T> {
  return Object.assign(Promise.resolve(val), val as object) as T & Promise<T>;
}

function makeQueryChain() {
  const chain: Record<string, unknown> = {
    then: (resolve: (v: unknown) => unknown) => resolve([]),
    catch: () => chain,
    finally: () => chain,
  };
  const methods = [
    'select', 'from', 'where', 'orderBy', 'limit', 'offset', 'groupBy', 'leftJoin',
    'insert', 'values', 'update', 'set', 'delete', 'returning', 'onConflictDoNothing',
  ];
  for (const m of methods) {
    chain[m] = () => chain;
  }
  return chain;
}

function makeMock(): typeof db {
  return new Proxy({} as typeof db, {
    get() {
      return () => makeQueryChain();
    },
  });
}

export default new Proxy({} as typeof db, {
  get(_target, prop: string | symbol) {
    if (!db) {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        return (makeMock() as unknown as Record<string | symbol, unknown>)[prop];
      }
      const client = postgres(connectionString, { prepare: false });
      db = drizzle(client, { schema });
    }
    return (db as unknown as Record<string | symbol, unknown>)[prop];
  },
});
