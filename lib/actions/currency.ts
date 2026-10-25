"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { CURRENCY_COOKIE } from "@/lib/display-currency";

const currencySchema = z.enum(SUPPORTED_CURRENCIES as [string, ...string[]]);

/** Remembers the visitor's currency choice; setting the cookie re-renders the page with new prices. */
export async function setDisplayCurrency(currency: string) {
  const parsed = currencySchema.safeParse(currency);
  if (!parsed.success) throw new Error("Unsupported currency.");
  (await cookies()).set(CURRENCY_COOKIE, parsed.data, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
  });
}
