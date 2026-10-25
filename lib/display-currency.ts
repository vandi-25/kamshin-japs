import "server-only";

import { cookies, headers } from "next/headers";

import { currencyForCountry, isSupportedCurrency, type CurrencyCode } from "@/lib/currency";

export const CURRENCY_COOKIE = "kamshin-currency";

/**
 * The currency to show prices in: the visitor's own choice if they picked one, otherwise
 * the currency of the country their request comes from (set by Vercel or Cloudflare).
 */
export async function getDisplayCurrency(): Promise<CurrencyCode> {
  const chosen = (await cookies()).get(CURRENCY_COOKIE)?.value;
  if (isSupportedCurrency(chosen)) return chosen;

  const h = await headers();
  return currencyForCountry(h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry"));
}
