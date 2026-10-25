import type { ExchangeRates } from "@/app/lib/currency";

/** Free, keyless rates (updated daily). Override with EXCHANGE_RATES_URL for another provider or testing. */
const RATES_URL = process.env.EXCHANGE_RATES_URL ?? "https://open.er-api.com/v6/latest";

export const RATES_REVALIDATE_SECONDS = 3600;

/** Returns rates relative to `base`, or null if the provider is unreachable, so pages can degrade gracefully. */
export async function getExchangeRates(base = "USD"): Promise<ExchangeRates | null> {
  try {
    const res = await fetch(`${RATES_URL}/${base}`, { next: { revalidate: RATES_REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result !== "success" || typeof data.rates !== "object") return null;
    return { base: data.base_code, rates: data.rates, updatedAt: data.time_last_update_utc };
  } catch {
    return null;
  }
}
