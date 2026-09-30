import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/catalog";
import { discountPercent } from "@/lib/money";

import { Price } from "./price";
import { ProductVisual } from "./product-visual";
import { LOW_STOCK_THRESHOLD } from "./stock-status";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.priceKobo, product.compareAtPriceKobo);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
    >
      <div className="relative overflow-hidden rounded-md">
        <ProductVisual product={product} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock <= 0 ? (
            <Badge variant="secondary">Sold out</Badge>
          ) : discount ? (
            <Badge variant="gold">Save {discount}%</Badge>
          ) : product.stock <= LOW_STOCK_THRESHOLD ? (
            <Badge variant="outline" className="bg-card/80">
              Few left
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs tracking-[0.18em] text-gold-text uppercase">
          {product.concentration} · {product.sizeMl}ml
        </p>
        <h3 className="text-xl leading-tight text-foreground group-hover:text-burgundy">{product.name}</h3>
        <Price priceKobo={product.priceKobo} compareAtPriceKobo={product.compareAtPriceKobo} className="text-sm" />
      </div>
    </Link>
  );
}
