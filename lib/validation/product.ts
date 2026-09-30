import { z } from "zod";

import { MAX_KOBO, nairaToKobo } from "@/lib/money";

const nairaField = (label: string) =>
  z.string().transform((value, ctx) => {
    const kobo = nairaToKobo(value);
    if (kobo === null) {
      ctx.addIssue({ code: "custom", message: `Enter a valid ${label}, e.g. 125000` });
      return z.NEVER;
    }
    return kobo;
  });

const optionalNairaField = (label: string) =>
  z.string().transform((value, ctx) => {
    if (value.trim() === "") return null;
    const kobo = nairaToKobo(value);
    if (kobo === null) {
      ctx.addIssue({ code: "custom", message: `Enter a valid ${label} or leave it empty` });
      return z.NEVER;
    }
    return kobo;
  });

const notesField = z
  .string()
  .max(300)
  .transform((v) =>
    v
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .slice(0, 8),
  );

const wholeNumber = (label: string, max: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, `${label} must be a whole number`)
    .transform(Number)
    .pipe(z.number().int().min(0).max(max, `${label} is too large`));

/** Admin product form. Prices are typed in naira and stored as integer kobo. */
export const productFormSchema = z
  .object({
    name: z.string().trim().min(2, "Enter a product name").max(80),
    slug: z
      .string()
      .trim()
      .min(2, "Enter a URL slug")
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens"),
    description: z.string().trim().min(20, "Write at least a short description (20+ characters)").max(2000),
    price: nairaField("price"),
    compareAtPrice: optionalNairaField("compare-at price"),
    stock: wholeNumber("Stock", 100_000),
    categoryId: z.string().min(1, "Choose a category"),
    sizeMl: wholeNumber("Size", 1000),
    concentration: z.string().trim().min(1, "Choose a concentration").max(40),
    topNotes: notesField,
    heartNotes: notesField,
    baseNotes: notesField,
    isActive: z.boolean(),
    isFeatured: z.boolean(),
  })
  .refine((d) => d.compareAtPrice === null || d.compareAtPrice > d.price, {
    path: ["compareAtPrice"],
    message: "Compare-at price must be higher than the price",
  })
  .refine((d) => d.price <= MAX_KOBO, { path: ["price"], message: "Price is too large" });

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormOutput = z.output<typeof productFormSchema>;

/** Quick inline edit from the products table. */
export const quickEditSchema = z.object({
  price: nairaField("price"),
  stock: wholeNumber("Stock", 100_000),
});

export const CONCENTRATIONS = ["Extrait de Parfum", "Eau de Parfum", "Eau de Toilette", "Eau de Cologne", "Body Mist"] as const;

/** Vercel Blob upload rules (enforced again in onBeforeGenerateToken, Phase 7). */
export const IMAGE_RULES = {
  types: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 5 * 1024 * 1024,
  maxWidth: 1600,
} as const;
