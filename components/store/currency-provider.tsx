"use client";

import { createContext, useContext, type ReactNode } from "react";

import { convertMinorUnits, formatMajorUnits, STORE_CURRENCY, type CurrencyCode, type ExchangeRates } from "@/lib/currency";
import { formatNaira } from "@/lib/money";

type CurrencyContextValue = { selected: CurrencyCode; rates: ExchangeRates | null };

const CurrencyContext = createContext<CurrencyContextValue>({ selected: STORE_CURRENCY, rates: null });

export function CurrencyProvider({ selected, rates, children }: CurrencyContextValue & { children: ReactNode }) {
  return <CurrencyContext value={{ selected, rates }}>{children}</CurrencyContext>;
}

/**
 * Price formatting in the visitor's currency. Prices are stored and charged in kobo, so converted
 * amounts are indicative; when no rate is available everything falls back to naira.
 */
export function useMoney() {
  const { selected, rates } = useContext(CurrencyContext);
  const canConvert = selected !== STORE_CURRENCY && rates !== null && rates.rates[selected] !== undefined;
  const currency = canConvert ? selected : STORE_CURRENCY;

  function format(kobo: number): string {
    if (!canConvert) return formatNaira(kobo);
    const converted = convertMinorUnits(kobo, STORE_CURRENCY, currency, rates!);
    return converted === null ? formatNaira(kobo) : formatMajorUnits(converted, currency);
  }

  return { selected, currency, rates, isConverted: canConvert, format, formatNaira };
}
