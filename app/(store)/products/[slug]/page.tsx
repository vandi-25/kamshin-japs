import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Gift, ShieldCheck, Truck } from "lucide-react";

import { AddToCart } from "@/components/cart/add-to-cart";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/store/price";
import { ProductCard } from "@/components/store/product-card";
import { ProductGallery } from "@/components/store/product-gallery";
import { StockStatus } from "@/components/store/stock-status";
import { getCategory, getProductBySlug, listAllActiveProducts, listRelatedProducts } from "@/lib/catalog";
import { discountPercent, formatNaira } from "@/lib/money";

export async function generateStaticParams() {
  const all = await listAllActiveProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Fragrance not found" };
  return {
    title: product.name,
    description: `${product.name} ${product.concentration}, ${product.sizeMl}ml — ${formatNaira(product.priceKobo)}. ${product.description}`,
    openGraph: { title: `${product.name} | Kamshin`, description: product.description },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([getCategory(product.categoryId), listRelatedProducts(product, 4)]);
  const discount = discountPercent(product.priceKobo, product.compareAtPriceKobo);
  const pyramid = [
    { label: "Top notes", hint: "The first impression", notes: product.topNotes },
    { label: "Heart notes", hint: "The character", notes: product.heartNotes },
    { label: "Base notes", hint: "What lingers", notes: product.baseNotes },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-burgundy">Home</Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li>
            <Link href="/products" className="hover:text-burgundy">Fragrances</Link>
          </li>
          {category && (
            <>
              <ChevronRight className="size-3" aria-hidden />
              <li>
                <Link href={`/products?category=${category.slug}`} className="hover:text-burgundy">{category.name}</Link>
              </li>
            </>
          )}
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery name={product.name} tone={product.tone} shape={product.bottle} />

        <div className="lg:pt-4">
          <p className="text-xs tracking-[0.22em] text-gold-text uppercase">
            {category?.name} · {product.concentration}
          </p>
          <h1 className="mt-3 text-5xl leading-none text-foreground sm:text-6xl">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{product.sizeMl}ml</p>

          <div className="mt-6 flex items-center gap-3">
            <Price priceKobo={product.priceKobo} compareAtPriceKobo={product.compareAtPriceKobo} className="text-2xl" />
            {discount && <Badge variant="gold">Save {discount}%</Badge>}
          </div>
          <StockStatus stock={product.stock} className="mt-3" />

          <p className="mt-6 max-w-prose leading-relaxed text-foreground/85">{product.description}</p>

          <div className="mt-8">
            <AddToCart slug={product.slug} name={product.name} stock={product.stock} />
          </div>

          <ul className="mt-8 grid gap-3 border-y py-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="size-4 text-gold-text" aria-hidden /> Nationwide delivery</li>
            <li className="flex items-center gap-2"><Gift className="size-4 text-gold-text" aria-hidden /> Gift wrapping</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-gold-text" aria-hidden /> Sealed & authentic</li>
          </ul>

          <section aria-labelledby="notes-heading" className="mt-8">
            <h2 id="notes-heading" className="text-3xl">Fragrance notes</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              {pyramid.map((tier) => (
                <div key={tier.label} className="rounded-md border bg-card p-4">
                  <dt>
                    <span className="text-xs tracking-[0.18em] text-gold-text uppercase">{tier.label}</span>
                    <span className="block text-xs text-muted-foreground">{tier.hint}</span>
                  </dt>
                  <dd className="mt-3 font-serif text-lg leading-snug">{tier.notes.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-8 divide-y border-y">
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                Delivery & returns
                <ChevronRight className="size-4 transition-transform group-open:rotate-90" aria-hidden />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Delivered in 1–3 working days in Lagos and 3–5 working days elsewhere in Nigeria. A
                flat delivery fee is added at checkout. Unopened, sealed fragrances can be returned
                within 7 days.
              </p>
            </details>
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                How to wear it
                <ChevronRight className="size-4 transition-transform group-open:rotate-90" aria-hidden />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Apply to pulse points — wrists, neck and behind the ears — after moisturising. Don&apos;t
                rub it in; let the notes unfold naturally on the skin.
              </p>
            </details>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-24">
          <p className="text-xs tracking-[0.22em] text-gold-text uppercase">You may also love</p>
          <h2 id="related-heading" className="mt-2 mb-10 text-4xl">More from {category?.name}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
