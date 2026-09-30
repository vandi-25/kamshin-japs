/**
 * Seed: first admin + sample categories and products.
 * Run with `npx prisma db seed`. Safe to re-run (upserts by email/slug).
 *
 * Admins can only come from here or from an existing admin promoting a user.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

import { PrismaClient } from "../generated/prisma/client";
import { nairaToKobo } from "../lib/money";
import { hashPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../lib/password";
import { slugify } from "../lib/slug";

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

const categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty"] as const;
type CategoryName = (typeof categories)[number];

type SeedProduct = {
  name: string;
  category: CategoryName;
  /** Naira strings, converted to integer kobo with nairaToKobo (no floats). */
  price: string;
  compareAt?: string;
  stock: number;
  description: string;
};

const products: SeedProduct[] = [
  { name: "Wireless Earbuds Pro", category: "Electronics", price: "45000", compareAt: "55000", stock: 25, description: "Bluetooth 5.3 earbuds with active noise cancellation and 30-hour battery life with the charging case." },
  { name: "20,000mAh Power Bank", category: "Electronics", price: "18500", stock: 40, description: "Fast-charging power bank with USB-C PD and two USB-A ports. Charges a phone up to four times." },
  { name: "Smart Fitness Watch", category: "Electronics", price: "62000", compareAt: "75000", stock: 12, description: "Heart-rate, sleep and step tracking with a bright AMOLED display and seven-day battery." },
  { name: "Portable Bluetooth Speaker", category: "Electronics", price: "27500", stock: 3, description: "Water-resistant speaker with deep bass and 12 hours of playback. Pairs two speakers for stereo." },
  { name: "Ankara Print Shirt", category: "Fashion", price: "15000", stock: 30, description: "Short-sleeve cotton shirt in a bold Ankara print. Relaxed fit, available in one colourway." },
  { name: "Leather Crossbody Bag", category: "Fashion", price: "32000", compareAt: "38000", stock: 8, description: "Handmade genuine leather crossbody bag with adjustable strap and zip closure." },
  { name: "Classic Canvas Sneakers", category: "Fashion", price: "21000", stock: 0, description: "Everyday low-top canvas sneakers with a cushioned insole and rubber sole." },
  { name: "Non-stick Frying Pan 28cm", category: "Home & Kitchen", price: "14500", stock: 22, description: "Durable non-stick pan suitable for gas and electric hobs. Easy to clean." },
  { name: "Electric Kettle 1.7L", category: "Home & Kitchen", price: "16800", compareAt: "19500", stock: 15, description: "Stainless-steel kettle with auto shut-off and boil-dry protection." },
  { name: "Blender 1.5L", category: "Home & Kitchen", price: "38000", stock: 6, description: "Powerful 600W blender with glass jar, ideal for smoothies, pepper and tomato blends." },
  { name: "Shea Butter Body Cream", category: "Beauty", price: "6500", stock: 50, description: "Rich moisturising cream made with unrefined Nigerian shea butter. 250ml." },
  { name: "Black Soap Face Wash", category: "Beauty", price: "4200", compareAt: "5000", stock: 35, description: "Gentle African black soap cleanser for all skin types. 200ml." },
];

function toKobo(naira: string, label: string): number {
  const kobo = nairaToKobo(naira);
  if (kobo === null) throw new Error(`Invalid naira amount for ${label}: ${naira}`);
  return kobo;
}

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

  // --- Categories ---
  const categoryIds = new Map<CategoryName, string>();
  for (const name of categories) {
    const slug = slugify(name);
    const category = await db.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
    categoryIds.set(name, category.id);
  }
  console.log(`✔ ${categories.length} categories`);

  // --- Products (no images: the storefront shows a placeholder) ---
  for (const product of products) {
    const slug = slugify(product.name);
    const priceKobo = toKobo(product.price, product.name);
    const compareAtPriceKobo = product.compareAt ? toKobo(product.compareAt, product.name) : null;
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) throw new Error(`Unknown category ${product.category}`);

    // update: {} → re-running the seed never overwrites prices/stock an admin has edited.
    await db.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: product.name,
        slug,
        description: product.description,
        priceKobo,
        compareAtPriceKobo,
        stock: product.stock,
        isActive: true,
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
