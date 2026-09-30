import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";

import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <ClearCartOnMount />
      <CircleCheck className="size-14 text-success" aria-hidden strokeWidth={1.25} />
      <p className="mt-6 text-xs tracking-[0.22em] text-gold-text uppercase">Payment received</p>
      <h1 className="mt-3 text-5xl">Thank you for your order</h1>
      <p className="mt-4 text-muted-foreground">
        Order <span className="font-medium text-foreground">KMS-PREVIEW-1025</span> is confirmed. We&apos;ll email
        your receipt and let you know as soon as it ships.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">(Design preview — no payment was taken.)</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild className="tracking-[0.12em] uppercase">
          <Link href="/account/orders">View my orders</Link>
        </Button>
        <Button asChild variant="outline" className="tracking-[0.12em] uppercase">
          <Link href="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
