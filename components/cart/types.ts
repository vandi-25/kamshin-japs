import type { BottleShape } from "@/lib/demo/catalog";

/** The product fields the browser needs to render bag lines (no internal data). */
export type CartProduct = {
  slug: string;
  name: string;
  priceKobo: number;
  stock: number;
  sizeMl: number;
  concentration: string;
  tone: string;
  bottle: BottleShape;
};
