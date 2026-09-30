/**
 * Catalogue queries used by store and admin pages.
 *
 * DESIGN PREVIEW: these read the in-memory sample catalogue so the site runs with
 * no environment variables. Phase 4 swaps the bodies for Prisma queries (lib/db.ts)
 * with the same signatures, so pages don't change.
 */
import { categories, categoryById, products, type Category, type Product } from "@/lib/demo/catalog";

export type { Category, Product };

export type SortOption = "newest" | "price-asc" | "price-desc";

export type ProductQuery = {
  q?: string;
  category?: string;
  minKobo?: number;
  maxKobo?: number;
  sort?: SortOption;
  page?: number;
  perPage?: number;
  /** Admin views include inactive products. */
  includeInactive?: boolean;
};

export type ProductPage = {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
};

export async function listCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCategory(id: string): Promise<Category | null> {
  return categoryById(id) ?? null;
}

export async function countProductsByCategory(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
  return counts;
}

export async function listProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const perPage = query.perPage ?? 9;
  let items = products.filter((p) => query.includeInactive || p.isActive);

  if (query.q) {
    const needle = query.q.trim().toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(needle));
  }
  if (query.category) {
    const category = categories.find((c) => c.slug === query.category);
    items = category ? items.filter((p) => p.categoryId === category.id) : [];
  }
  if (query.minKobo !== undefined) items = items.filter((p) => p.priceKobo >= query.minKobo!);
  if (query.maxKobo !== undefined) items = items.filter((p) => p.priceKobo <= query.maxKobo!);

  const sort = query.sort ?? "newest";
  items = [...items].sort((a, b) => {
    if (sort === "price-asc") return a.priceKobo - b.priceKobo;
    if (sort === "price-desc") return b.priceKobo - a.priceKobo;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  return { items: items.slice((page - 1) * perPage, page * perPage), total, page, pageCount };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

export async function listFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.isActive && p.isFeatured).slice(0, limit);
}

/** Newest active products that aren't already featured (so home sections don't repeat). */
export async function listNewArrivals(limit = 4): Promise<Product[]> {
  return [...products]
    .filter((p) => p.isActive && !p.isFeatured)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function listRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products
    .filter((p) => p.isActive && p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}

export async function listAllActiveProducts(): Promise<Product[]> {
  return products.filter((p) => p.isActive);
}

export async function listLowStock(threshold = 10): Promise<Product[]> {
  return products.filter((p) => p.stock <= threshold).sort((a, b) => a.stock - b.stock);
}
