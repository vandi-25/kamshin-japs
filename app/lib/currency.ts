export type CurrencyCode = string;

export type PaymentRequest = {
  /** Amount in the currency's minor unit (cents, yen, fils...), as payment providers expect. */
  amountMinor: number;
  currency: CurrencyCode;
};

export const DEFAULT_CURRENCIES: CurrencyCode[] = [
  "USD", "EUR", "GBP", "JPY", "ILS", "CAD", "AUD", "CHF",
  "CNY", "INR", "KRW", "BRL", "MXN", "SGD", "AED", "KWD",
];

/** Number of decimal places a currency uses (USD 2, JPY 0, KWD 3), per ISO 4217 via Intl. */
export function currencyDecimals(currency: CurrencyCode): number {
  return new Intl.NumberFormat("en", { style: "currency", currency })
    .resolvedOptions().maximumFractionDigits ?? 2;
}

/**
 * Converts a user-typed amount ("12.5") to integer minor units using string math,
 * so floating-point rounding never changes what gets charged. Returns null if invalid.
 */
export function toMinorUnits(input: string, currency: CurrencyCode): number | null {
  const decimals = currencyDecimals(currency);
  const match = input.trim().match(/^(\d+)(?:\.(\d*))?$/);
  if (!match) return null;
  const [, whole, fraction = ""] = match;
  if (fraction.length > decimals) return null;
  const minor = Number(whole + fraction.padEnd(decimals, "0"));
  return Number.isSafeInteger(minor) ? minor : null;
}

export function formatMinorUnits(amountMinor: number, currency: CurrencyCode, locale: string): string {
  const decimals = currencyDecimals(currency);
  return new Intl.NumberFormat(locale, { style: "currency", currency })
    .format(amountMinor / 10 ** decimals);
}

export type ExchangeRates = {
  base: CurrencyCode;
  /** Units of each currency per 1 unit of `base`. */
  rates: Record<CurrencyCode, number>;
  updatedAt: string;
};

/** Converts a minor-unit amount between currencies; returns major units of `to`, or null if a rate is missing. */
export function convertMinorUnits(
  amountMinor: number,
  from: CurrencyCode,
  to: CurrencyCode,
  { rates }: ExchangeRates,
): number | null {
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return null;
  return (amountMinor / 10 ** currencyDecimals(from) / fromRate) * toRate;
}

export function formatMajorUnits(amount: number, currency: CurrencyCode, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function currencyName(currency: CurrencyCode, locale: string): string {
  return new Intl.DisplayNames([locale], { type: "currency" }).of(currency) ?? currency;
}
