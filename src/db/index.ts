import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Single connection factory for the whole app.
 *
 * - DATABASE_URL set  → real Postgres via postgres.js (production).
 * - DATABASE_URL empty → embedded Postgres (PGlite) persisted in ./.pglite,
 *   cached across dev-server reloads through globalThis. Zero local setup.
 */
function createDb() {
  if (process.env.DATABASE_URL) {
    const client = postgres(process.env.DATABASE_URL, { max: 5 });
    return {
      db: drizzlePostgres(client, { schema }),
      close: async () => {
        await client.end();
      },
    };
  }

  const g = globalThis as unknown as { __rimaPglite?: PGlite };
  const pglite = g.__rimaPglite ?? new PGlite("./.pglite");
  g.__rimaPglite = pglite;
  return {
    db: drizzlePglite(pglite, { schema }),
    close: async () => {
      await pglite.close();
    },
  };
}

export const { db } = createDb();
export { schema };
