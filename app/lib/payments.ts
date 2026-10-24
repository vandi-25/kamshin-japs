"use server";

import { currencyDecimals, type PaymentRequest } from "@/app/lib/currency";

export async function payAction({ amountMinor, currency }: PaymentRequest) {
  // Server Functions are reachable by direct POST, so never trust the client: re-validate here.
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Unsupported currency.");
  currencyDecimals(currency); // throws RangeError for codes Intl doesn't know
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) throw new Error("Invalid amount.");

  // TODO: authenticate the user, then create the charge with your payment provider, e.g.
  // stripe.paymentIntents.create({ amount: amountMinor, currency: currency.toLowerCase() })
  console.log(`Payment requested: ${amountMinor} minor units of ${currency}`);
}
