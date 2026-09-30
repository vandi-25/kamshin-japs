import type { Metadata } from "next";

import { CheckoutView } from "@/components/cart/checkout-view";
import { listCartProducts } from "@/lib/demo/cart-products";
import { customerById, DEMO_CUSTOMER_ID, DEMO_SHIPPING_KOBO, demoAddresses } from "@/lib/demo/orders";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const products = await listCartProducts();
  const customer = customerById(DEMO_CUSTOMER_ID);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs tracking-[0.22em] text-gold-text uppercase">Secure checkout</p>
      <h1 className="mt-2 mb-10 text-5xl">Checkout</h1>
      <CheckoutView
        products={products}
        shippingKobo={DEMO_SHIPPING_KOBO}
        addresses={demoAddresses}
        customerName={customer?.name ?? "Guest"}
      />
    </div>
  );
}
