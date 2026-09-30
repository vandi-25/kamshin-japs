import { z } from "zod";

/**
 * Money is always an integer number of kobo (₦1 = 100 kobo).
 * Floats are never used for amounts; conversion to naira happens only as a
 * decimal *string* at display time, so there is no floating-point rounding.
 */

export const KOBO_PER_NAIRA = 100;

/** Largest value a Postgres `integer` column can hold (≈ ₦21.4m). */
export const MAX_KOBO = 2_147_483_647;

export function isKobo(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_KOBO;
}

function assertKobo(value: number, label = "amount"): void {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`${label} must be an integer number of kobo, got ${value}`);
  }
}

/** Exact decimal naira string for a kobo integer, e.g. 123450 → "1234.50", -5 → "-0.05". */
export function koboToNairaString(kobo: number): string {
  assertKobo(kobo);
  const sign = kobo < 0 ? "-" : "";
  const abs = Math.abs(kobo);
  const naira = Math.trunc(abs / KOBO_PER_NAIRA);
  const rem = abs % KOBO_PER_NAIRA;
  return `${sign}${naira}.${String(rem).padStart(2, "0")}`;
}

/** Value for a naira form input: 1250000 → "12500", 123450 → "1234.50". */
export function koboToNairaInput(kobo: number): string {
  return koboToNairaString(kobo).replace(/\.00$/, "");
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const wholeNairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format kobo as NGN for display: 1250000 → "₦12,500", 123450 → "₦1,234.50".
 * Whole-naira amounts drop the ".00" unless `alwaysShowKobo` is set.
 */
export function formatNaira(kobo: number, options: { alwaysShowKobo?: boolean } = {}): string {
  const decimal = koboToNairaString(kobo);
  // Intl accepts exact decimal strings, so no float conversion happens here.
  const value = decimal as Intl.StringNumericLiteral;
  if (!options.alwaysShowKobo && kobo % KOBO_PER_NAIRA === 0) {
    return wholeNairaFormatter.format(value);
  }
  return nairaFormatter.format(value);
}

/**
 * Parse a user-typed naira amount into kobo without floats.
 * Accepts "12500", "12,500", "12500.5", "₦12,500.50". Returns null if invalid,
 * negative, more than 2 decimal places, or above MAX_KOBO.
 */
export function nairaToKobo(input: string): number | null {
  const cleaned = input.trim().replace(/^₦/, "").replace(/,/g, "").trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const [, whole, fraction = ""] = match;
  const kobo = Number(whole) * KOBO_PER_NAIRA + Number(fraction.padEnd(2, "0"));
  return isKobo(kobo) ? kobo : null;
}

/** Line total for a unit price × quantity, both integers. */
export function lineTotalKobo(unitPriceKobo: number, quantity: number): number {
  assertKobo(unitPriceKobo, "unitPriceKobo");
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new TypeError(`quantity must be a non-negative integer, got ${quantity}`);
  }
  const total = unitPriceKobo * quantity;
  assertKobo(total, "line total");
  return total;
}

/** Sum of kobo integers. */
export function sumKobo(amounts: readonly number[]): number {
  let total = 0;
  for (const amount of amounts) {
    assertKobo(amount);
    total += amount;
  }
  assertKobo(total, "sum");
  return total;
}

/**
 * Whole-number percentage saved versus the compare-at price, for "Save 20%" badges.
 * Returns null when there is no genuine discount.
 */
export function discountPercent(priceKobo: number, compareAtPriceKobo: number | null | undefined): number | null {
  if (compareAtPriceKobo == null || compareAtPriceKobo <= priceKobo || compareAtPriceKobo <= 0) return null;
  return Math.round(((compareAtPriceKobo - priceKobo) * 100) / compareAtPriceKobo);
}

/** Zod schema for an integer kobo amount (server-side validation). */
export const koboSchema = z
  .number({ error: "Enter an amount" })
  .int("Amount must be a whole number of kobo")
  .min(0, "Amount can't be negative")
  .max(MAX_KOBO, "Amount is too large");

/** Zod schema for a naira amount typed into a form; outputs integer kobo. */
export const nairaInputSchema = z.string().transform((value, ctx) => {
  const kobo = nairaToKobo(value);
  if (kobo === null) {
    ctx.addIssue({ code: "custom", message: "Enter a valid naira amount, e.g. 12500 or 12,500.50" });
    return z.NEVER;
  }
  return kobo;
});
