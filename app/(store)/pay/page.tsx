import type { Metadata } from "next";

import { CurrencyPayment } from "@/components/payment/currency-payment";
import { payAction } from "@/lib/actions/payments";

export const metadata: Metadata = { title: "Make a payment", robots: { index: false } };

export default function PayPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs tracking-[0.22em] text-gold-text uppercase">Secure payment</p>
      <h1 className="mt-2 mb-3 text-5xl">Make a payment</h1>
      <p className="mb-10 max-w-md text-center text-muted-foreground">
        Pay an amount in naira or your own currency — for example a custom order or a balance due.
      </p>
      <CurrencyPayment payAction={payAction} />
    </div>
  );
}
