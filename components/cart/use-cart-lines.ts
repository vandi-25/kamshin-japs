"use client";

import { useCart } from "@/lib/demo/cart-store";
import { lineTotalKobo, sumKobo } from "@/lib/money";

import type { CartProduct } from "./types";

export function useCartLines(products: CartProduct[]) {
  const cart = useCart();
  const lines = Object.entries(cart)
    .map(([slug, quantity]) => {
      const product = products.find((p) => p.slug === slug);
      return product ? { product, quantity, lineKobo: lineTotalKobo(product.priceKobo, quantity) } : null;
    })
    .filter((l) => l !== null);
  const subtotalKobo = sumKobo(lines.map((l) => l.lineKobo));
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  return { lines, subtotalKobo, itemCount };
}
