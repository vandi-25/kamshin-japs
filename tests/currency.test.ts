import { describe, expect, it } from "vitest";

import {
  convertMinorUnits,
  currencyDecimals,
  currencyForCountry,
  formatMinorUnits,
  isSupportedCurrency,
  toMinorUnits,
  type ExchangeRates,
} from "@/lib/currency";

// Made-up round numbers so the expected values are easy to check by hand.
const rates: ExchangeRates = { base: "NGN", rates: { NGN: 1, USD: 0.0005, JPY: 0.1, KWD: 0.0002 }, updatedAt: "" };

describe("currencyForCountry", () => {
  it("maps countries to their currency", () => {
    expect(currencyForCountry("NG")).toBe("NGN");
    expect(currencyForCountry("gb")).toBe("GBP");
    expect(currencyForCountry("DE")).toBe("EUR");
    expect(currencyForCountry("GH")).toBe("GHS");
  });
  it("uses USD for unsupported countries and NGN when the country is unknown", () => {
    expect(currencyForCountry("BD")).toBe("USD");
    expect(currencyForCountry(null)).toBe("NGN");
  });
});

describe("currencyDecimals", () => {
  it("follows ISO 4217", () => {
    expect(currencyDecimals("NGN")).toBe(2);
    expect(currencyDecimals("JPY")).toBe(0);
    expect(currencyDecimals("KWD")).toBe(3);
  });
});

describe("toMinorUnits", () => {
  it("parses naira with thousands separators and a symbol", () => {
    expect(toMinorUnits("12,500", "NGN")).toBe(1_250_000);
    expect(toMinorUnits("₦12,500.50", "NGN")).toBe(1_250_050);
  });
  it("is exact where float math is not", () => {
    expect(toMinorUnits("0.3", "NGN")).toBe(30);
    expect(toMinorUnits("10.125", "KWD")).toBe(10_125);
  });
  it("rejects too many decimals, negatives and junk", () => {
    expect(toMinorUnits("1500.5", "JPY")).toBeNull();
    expect(toMinorUnits("1.234", "NGN")).toBeNull();
    expect(toMinorUnits("-5", "NGN")).toBeNull();
    expect(toMinorUnits("abc", "NGN")).toBeNull();
  });
});

describe("formatMinorUnits", () => {
  it("formats with the currency's own decimals", () => {
    expect(formatMinorUnits(1_250_000, "NGN")).toBe("₦12,500.00");
    expect(formatMinorUnits(1500, "JPY")).toBe("¥1,500");
  });
});

describe("convertMinorUnits", () => {
  it("converts kobo into other currencies", () => {
    expect(convertMinorUnits(4_500_000, "NGN", "USD", rates)).toBeCloseTo(22.5); // ₦45,000
    expect(convertMinorUnits(4_500_000, "NGN", "JPY", rates)).toBeCloseTo(4500);
  });
  it("converts other currencies back into naira", () => {
    expect(convertMinorUnits(2250, "USD", "NGN", rates)).toBeCloseTo(45_000); // $22.50
    expect(convertMinorUnits(1000, "KWD", "NGN", rates)).toBeCloseTo(5000); // KWD 1.000
  });
  it("returns null when a rate is missing", () => {
    expect(convertMinorUnits(100, "NGN", "EUR", rates)).toBeNull();
  });
});

describe("isSupportedCurrency", () => {
  it("only accepts listed codes", () => {
    expect(isSupportedCurrency("NGN")).toBe(true);
    expect(isSupportedCurrency("XYZ")).toBe(false);
    expect(isSupportedCurrency(undefined)).toBe(false);
  });
});
