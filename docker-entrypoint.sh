#!/bin/sh
set -e

# Rimaweb container bootstrap: wait for the database, push the Drizzle
# schema and seed the admin account (both idempotent), then start Next.js.

if [ -n "$DATABASE_URL" ]; then
  echo "→ waiting for database…"
  i=0
  until node -e "
    const net = require('node:net');
    const u = new URL(process.env.DATABASE_URL);
    const s = net.connect(Number(u.port) || 5432, u.hostname, () => { s.end(); process.exit(0); });
    s.on('error', () => process.exit(1));
    s.setTimeout(2000, () => { s.destroy(); process.exit(1); });
  " 2>/dev/null; do
    i=$((i + 1))
    if [ "$i" -ge 30 ]; then
      echo "✗ database unreachable after 30s" >&2
      exit 1
    fi
    sleep 1
  done

  echo "→ pushing database schema (drizzle-kit push)"
  npx drizzle-kit push --force
fi

echo "→ seeding admin & sample data (idempotent)"
npm run db:seed || echo "⚠ seed failed — continuing anyway" >&2

echo "→ starting next server"
exec "$@"
