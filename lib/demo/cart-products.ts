import type { CartProduct } from "@/components/cart/types";
import { listAllActiveProducts } from "@/lib/catalog";

export async function listCartProducts(): Promise<CartProduct[]> {
  const all = await listAllActiveProducts();
  return all.map((p) => ({
    slug: p.slug,
    name: p.name,
    priceKobo: p.priceKobo,
    stock: p.stock,
    sizeMl: p.sizeMl,
    concentration: p.concentration,
    tone: p.tone,
    bottle: p.bottle,
  }));
}
