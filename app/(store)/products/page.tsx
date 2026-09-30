import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Pagination } from "@/components/store/pagination";
import { ProductCard } from "@/components/store/product-card";
import { getCategoryBySlug, listCategories, listProducts } from "@/lib/catalog";
import { koboToNairaInput } from "@/lib/money";
import { cn } from "@/lib/utils";
import { productFiltersSchema } from "@/lib/validation/product-filters";

export async function generateMetadata(props: PageProps<"/products">): Promise<Metadata> {
  const filters = productFiltersSchema.parse(await props.searchParams);
  const category = filters.category ? await getCategoryBySlug(filters.category) : null;
  return {
    title: category ? `${category.name} Fragrances` : "Shop All Fragrances",
    description: category
      ? `${category.tagline}. Shop ${category.name.toLowerCase()} perfumes at Kamshin.`
      : "Browse luxury perfumes by collection, notes and price. Delivered across Nigeria.",
  };
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export default async function ProductsPage(props: PageProps<"/products">) {
  const filters = productFiltersSchema.parse(await props.searchParams);
  const [categories, result] = await Promise.all([
    listCategories(),
    listProducts({
      q: filters.q,
      category: filters.category,
      minKobo: filters.min,
      maxKobo: filters.max,
      sort: filters.sort,
      page: filters.page,
    }),
  ]);
  const activeCategory = categories.find((c) => c.slug === filters.category);

  const params = (overrides: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const base: Record<string, string | undefined> = {
      q: filters.q,
      category: filters.category,
      min: filters.min !== undefined ? koboToNairaInput(filters.min) : undefined,
      max: filters.max !== undefined ? koboToNairaInput(filters.max) : undefined,
      sort: filters.sort,
      ...overrides,
    };
    for (const [k, v] of Object.entries(base)) if (v) sp.set(k, v);
    const s = sp.toString();
    return s ? `/products?${s}` : "/products";
  };

  const chip =
    "rounded-full border px-4 py-2 text-xs tracking-[0.12em] uppercase transition-colors hover:border-burgundy focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.22em] text-gold-text uppercase">
          {activeCategory ? "Collection" : "The collection"}
        </p>
        <h1 className="mt-2 text-5xl text-foreground sm:text-6xl">{activeCategory?.name ?? "All fragrances"}</h1>
        <p className="mt-3 text-muted-foreground">
          {activeCategory?.tagline ?? "Every scent in the house, from luminous florals to deep, resinous ouds."}
        </p>
      </header>

      {/* Collection chips */}
      <nav aria-label="Collections" className="mt-8 flex flex-wrap gap-2">
        <Link
          href={params({ category: undefined, page: undefined })}
          aria-current={!activeCategory ? "page" : undefined}
          className={cn(chip, !activeCategory && "border-burgundy bg-burgundy text-ivory")}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={params({ category: c.slug, page: undefined })}
            aria-current={activeCategory?.id === c.id ? "page" : undefined}
            className={cn(chip, activeCategory?.id === c.id && "border-burgundy bg-burgundy text-ivory")}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {/* Filters (plain GET form: works without JavaScript) */}
      <form action="/products" className="mt-6 grid gap-3 rounded-md border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.3fr_auto]">
        {filters.category && <input type="hidden" name="category" value={filters.category} />}
        <div>
          <label htmlFor="q" className="mb-1.5 block text-xs text-muted-foreground">
            Search
          </label>
          <Input id="q" name="q" type="search" defaultValue={filters.q} placeholder="Search by name, e.g. Oud" />
        </div>
        <div>
          <label htmlFor="min" className="mb-1.5 block text-xs text-muted-foreground">
            Min price (₦)
          </label>
          <Input id="min" name="min" inputMode="numeric" placeholder="0" defaultValue={filters.min !== undefined ? koboToNairaInput(filters.min) : undefined} />
        </div>
        <div>
          <label htmlFor="max" className="mb-1.5 block text-xs text-muted-foreground">
            Max price (₦)
          </label>
          <Input id="max" name="max" inputMode="numeric" placeholder="Any" defaultValue={filters.max !== undefined ? koboToNairaInput(filters.max) : undefined} />
        </div>
        <div>
          <label htmlFor="sort" className="mb-1.5 block text-xs text-muted-foreground">
            Sort by
          </label>
          <NativeSelect id="sort" name="sort" defaultValue={filters.sort ?? "newest"}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" className="h-10 flex-1 tracking-[0.12em] uppercase lg:flex-none">
            Apply
          </Button>
          <Button asChild variant="ghost" className="h-10">
            <Link href={activeCategory ? `/products?category=${activeCategory.slug}` : "/products"}>Clear</Link>
          </Button>
        </div>
      </form>

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {result.total} {result.total === 1 ? "fragrance" : "fragrances"}
        {filters.q ? ` matching “${filters.q}”` : ""}
      </p>

      {result.items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-md border border-dashed bg-card px-6 py-20 text-center">
          <SearchX className="size-10 text-taupe" aria-hidden />
          <h2 className="mt-4 text-3xl">No fragrances found</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Try a different name, widen the price range, or browse the whole collection.
          </p>
          <Button asChild className="mt-6 tracking-[0.12em] uppercase">
            <Link href="/products">View all fragrances</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
          {result.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination page={result.page} pageCount={result.pageCount} hrefFor={(n) => params({ page: n > 1 ? String(n) : undefined })} />
    </div>
  );
}
