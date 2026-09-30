/**
 * Seed: first admin + the Kamshin fragrance catalogue (lib/demo/catalog.ts).
 * Run with `npx prisma db seed`. Safe to re-run (upserts by email/slug).
 *
 * Admins can only come from here or from an existing admin promoting a user.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

import { PrismaClient } from "../generated/prisma/client";
import { categories, products } from "../lib/demo/catalog";
import { hashPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../lib/password";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SEED_ADMIN_EMAIL: z.email("SEED_ADMIN_EMAIL must be a valid email"),
  SEED_ADMIN_PASSWORD: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `SEED_ADMIN_PASSWORD must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `SEED_ADMIN_PASSWORD must be at most ${PASSWORD_MAX_LENGTH} characters`),
  SEED_ADMIN_NAME: z.string().min(1).default("Store Admin"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Seed aborted — fix these .env values:");
  for (const issue of parsedEnv.error.issues) console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  process.exit(1);
}
const env = parsedEnv.data;

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });

async function main() {
  // --- Admin ---
  const email = env.SEED_ADMIN_EMAIL.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    // Never overwrite an existing password from the seed; just make sure the role is ADMIN.
    if (existing.role !== "ADMIN") {
      await db.user.update({ where: { id: existing.id }, data: { role: "ADMIN" } });
      console.log(`✔ Promoted existing user ${email} to ADMIN (password unchanged)`);
    } else {
      console.log(`✔ Admin ${email} already exists (password unchanged)`);
    }
  } else {
    await db.user.create({
      data: {
        name: env.SEED_ADMIN_NAME,
        email,
        passwordHash: await hashPassword(env.SEED_ADMIN_PASSWORD),
        role: "ADMIN",
      },
    });
    console.log(`✔ Created admin ${email}`);
  }

  // --- Categories (same catalogue as the design preview) ---
  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, tagline: c.tagline },
    });
    categoryIds.set(c.id, row.id);
  }
  console.log(`✔ ${categories.length} categories`);

  // --- Products (no images yet: the storefront shows the bottle placeholder) ---
  for (const p of products) {
    const categoryId = categoryIds.get(p.categoryId);
    if (!categoryId) throw new Error(`Unknown category ${p.categoryId} for ${p.name}`);
    // update: {} → re-running the seed never overwrites prices/stock an admin has edited.
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        priceKobo: p.priceKobo,
        compareAtPriceKobo: p.compareAtPriceKobo,
        stock: p.stock,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        sizeMl: p.sizeMl,
        concentration: p.concentration,
        topNotes: p.topNotes,
        heartNotes: p.heartNotes,
        baseNotes: p.baseNotes,
        categoryId,
      },
    });
  }
  console.log(`✔ ${products.length} products`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
