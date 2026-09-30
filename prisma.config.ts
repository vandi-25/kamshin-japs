import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations and introspection use the Neon DIRECT (non-pooled) connection.
// The app runtime uses the pooled DATABASE_URL via the pg adapter in lib/db.ts.
// DIRECT_URL is read loosely so `prisma generate` (e.g. on Vercel's postinstall)
// works without a database; migrate commands fail loudly if it's missing.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
