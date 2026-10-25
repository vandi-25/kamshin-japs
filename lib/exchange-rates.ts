import "server-only";

import { STORE_CURRENCY, type ExchangeRates } from "@/lib/currency";

/** Free, keyless daily rates. Override with EXCHANGE_RATES_URL for another provider or for testing. */
const RATES_URL = process.env.EXCHANGE_RATES_URL ?? "https://open.er-api.com/v6/latest";

/**
 * Rates relative to `base` (NGN by default), cached for an hour. Returns null when the provider is
 * unreachable so the store falls back to showing naira instead of failing.
 */
export async function getExchangeRates(base = STORE_CURRENCY): Promise<ExchangeRates | null> {
  try {
    const res = await fetch(`${RATES_URL}/${base}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (
      !data ||
      typeof data !== "object" ||
      !("result" in data) ||
      data.result !== "success" ||
      !("rates" in data) ||
      typeof data.rates !== "object" ||
      data.rates === null
    ) {
      return null;
    }
    const { base_code, time_last_update_utc } = data as { base_code?: string; time_last_update_utc?: string };
    return {
      base: base_code ?? base,
      rates: data.rates as Record<string, number>,
      updatedAt: time_last_update_utc ?? "",
    };
  } catch {
    return null;
  }
}
