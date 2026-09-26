import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // When DATABASE_URL is set, push/migrations target the real Postgres cluster.
  // Without it, drizzle-kit talks to the embedded PGlite database in ./.pglite.
  ...(process.env.DATABASE_URL
    ? { dbCredentials: { url: process.env.DATABASE_URL } }
    : { driver: "pglite", dbCredentials: { url: "file:./.pglite" } }),
});
