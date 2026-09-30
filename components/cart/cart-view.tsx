"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BottleArt } from "@/components/store/bottle-art";
import { removeFromCart, setCartQuantity } from "@/lib/demo/cart-store";
import { formatNaira } from "@/lib/money";

import { QuantitySelector } from "./quantity-selector";
import type { CartProduct } from "./types";
import { useCartLines } from "./use-cart-lines";

export function CartView({ products, shippingKobo }: { products: CartProduct[]; shippingKobo: number }) {
  const { lines, subtotalKobo, itemCount } = useCartLines(products);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-md border border-dashed bg-card px-6 py-20 text-center">
        <ShoppingBag className="size-10 text-taupe" aria-hidden />
        <h2 className="mt-4 text-3xl">Your bag is empty</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">Discover a scent you&apos;ll love and it will wait for you here.</p>
        <Button asChild className="mt-6 tracking-[0.12em] uppercase">
          <Link href="/products">Shop fragrances</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <ul className="divide-y border-y">
        {lines.map(({ product, quantity, lineKobo }) => (
          <li key={product.slug} className="flex gap-4 py-6 sm:gap-6">
            <Link
              href={`/products/${product.slug}`}
              className="flex aspect-[4/5] w-24 shrink-0 items-end justify-center rounded-md bg-gradient-to-b from-[#f6efe7] to-[#ebdfd2] p-3 sm:w-28"
            >
              <BottleArt tone={product.tone} shape={product.bottle} name={product.name} />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <Link href={`/products/${product.slug}`} className="font-serif text-2xl leading-tight hover:text-burgundy">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-xs tracking-[0.14em] text-gold-text uppercase">
                    {product.concentration} · {product.sizeMl}ml
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatNaira(product.priceKobo)} each</p>
                </div>
                <p className="font-medium">{formatNaira(lineKobo)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <QuantitySelector
                  size="sm"
                  value={quantity}
                  max={product.stock}
                  label={`Quantity for ${product.name}`}
                  onChange={(q) => setCartQuantity(product.slug, q, product.stock)}
                />
                <Button variant="ghost" size="sm" onClick={() => removeFromCart(product.slug)} className="text-muted-foreground">
                  <Trash2 aria-hidden /> Remove
                </Button>
              </div>
              {quantity >= product.stock && (
                <p className="mt-2 text-xs text-warning">Maximum available quantity reached</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <aside aria-labelledby="summary-heading" className="h-fit rounded-md border bg-card p-6 lg:sticky lg:top-28">
        <h2 id="summary-heading" className="text-3xl">Order summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
            <dd>{formatNaira(subtotalKobo)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery (flat rate)</dt>
            <dd>{formatNaira(shippingKobo)}</dd>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-medium">
            <dt>Total</dt>
            <dd>{formatNaira(subtotalKobo + shippingKobo)}</dd>
          </div>
        </dl>
        <Button asChild size="lg" className="mt-6 w-full tracking-[0.14em] uppercase">
          <Link href="/checkout">Checkout</Link>
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">You&apos;ll sign in or create an account at checkout.</p>
        <Link href="/products" className="mt-5 block text-center text-sm text-burgundy underline-offset-4 hover:underline">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
