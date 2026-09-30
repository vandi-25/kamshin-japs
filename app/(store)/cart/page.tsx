import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { listCartProducts } from "@/lib/demo/cart-products";
import { DEMO_SHIPPING_KOBO } from "@/lib/demo/orders";

export const metadata: Metadata = { title: "Shopping Bag", robots: { index: false } };

export default async function CartPage() {
  const products = await listCartProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="mb-10 text-5xl">Shopping bag</h1>
      <CartView products={products} shippingKobo={DEMO_SHIPPING_KOBO} />
    </div>
  );
}
