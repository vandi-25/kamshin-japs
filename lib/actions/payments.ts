"use server";

import { z } from "zod";

import { currencyDecimals, SUPPORTED_CURRENCIES, type PaymentRequest } from "@/lib/currency";

const paymentSchema = z.object({
  currency: z.enum(SUPPORTED_CURRENCIES as [string, ...string[]]),
  amountMinor: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
});

export async function payAction(request: PaymentRequest) {
  // Server Functions are reachable by direct POST, so never trust the client: re-validate here.
  const parsed = paymentSchema.safeParse(request);
  if (!parsed.success) throw new Error("Invalid payment details.");
  const { amountMinor, currency } = parsed.data;
  currencyDecimals(currency);

  // DESIGN PREVIEW: nothing is charged yet. Phase 6 initializes the Paystack transaction here
  // (amount in minor units; currencies other than NGN must be enabled on the Paystack account).
  console.log(`Payment requested: ${amountMinor} minor units of ${currency}`);
}
