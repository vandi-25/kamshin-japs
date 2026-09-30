import { describe, expect, it } from "vitest";

import {
  discountPercent,
  formatNaira,
  koboToNairaString,
  lineTotalKobo,
  MAX_KOBO,
  nairaInputSchema,
  nairaToKobo,
  sumKobo,
} from "@/lib/money";

describe("formatNaira", () => {
  it("formats whole naira without kobo", () => {
    expect(formatNaira(1_250_000)).toBe("₦12,500");
    expect(formatNaira(0)).toBe("₦0");
  });
  it("shows kobo when present", () => {
    expect(formatNaira(123_450)).toBe("₦1,234.50");
    expect(formatNaira(5)).toBe("₦0.05");
  });
  it("can always show kobo", () => {
    expect(formatNaira(1_250_000, { alwaysShowKobo: true })).toBe("₦12,500.00");
  });
  it("rejects non-integer kobo", () => {
    expect(() => formatNaira(10.5)).toThrow(TypeError);
  });
});

describe("koboToNairaString", () => {
  it("is exact for values that break float math", () => {
    // 0.1 + 0.2 style problems never apply: 30 kobo is "0.30"
    expect(koboToNairaString(10 + 20)).toBe("0.30");
    expect(koboToNairaString(MAX_KOBO)).toBe("21474836.47");
    expect(koboToNairaString(-5)).toBe("-0.05");
  });
});

describe("nairaToKobo", () => {
  it.each([
    ["12500", 1_250_000],
    ["12,500", 1_250_000],
    ["₦12,500.50", 1_250_050],
    ["0.5", 50],
    ["19.99", 1999],
    [" 7 ", 700],
  ])("parses %s", (input, expected) => {
    expect(nairaToKobo(input)).toBe(expected);
  });
  it.each(["", "abc", "-5", "1.234", "1e3", "12.", ".5", "99999999"])("rejects %s", (input) => {
    expect(nairaToKobo(input)).toBeNull();
  });
});

describe("arithmetic", () => {
  it("computes line totals and sums as integers", () => {
    expect(lineTotalKobo(1999, 3)).toBe(5997);
    expect(sumKobo([5997, 250_000, 3])).toBe(256_000);
  });
  it("rejects fractional inputs", () => {
    expect(() => lineTotalKobo(19.99, 3)).toThrow(TypeError);
    expect(() => lineTotalKobo(1999, 1.5)).toThrow(TypeError);
    expect(() => sumKobo([1, 0.5])).toThrow(TypeError);
  });
});

describe("discountPercent", () => {
  it("returns the rounded saving", () => {
    expect(discountPercent(4_500_000, 5_500_000)).toBe(18);
  });
  it("returns null when there is no real discount", () => {
    expect(discountPercent(1000, null)).toBeNull();
    expect(discountPercent(1000, 1000)).toBeNull();
    expect(discountPercent(1000, 900)).toBeNull();
  });
});

describe("nairaInputSchema", () => {
  it("transforms form input to kobo", () => {
    expect(nairaInputSchema.parse("1,500.25")).toBe(150_025);
    expect(nairaInputSchema.safeParse("abc").success).toBe(false);
  });
});
