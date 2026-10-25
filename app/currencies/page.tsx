import type { Metadata } from "next";

import {
  DEFAULT_CURRENCIES,
  currencyDecimals,
  currencyName,
} from "@/app/lib/currency";
import { getExchangeRates } from "@/app/lib/exchange-rates";

export const metadata: Metadata = {
  title: "Currency codes & exchange rates",
};

export const revalidate = 3600;

const LOCALE = "en-US";
const BASE = "USD";

function formatRate(rate: number) {
  return rate.toLocaleString(LOCALE, { maximumSignificantDigits: 6 });
}

/** Shows sub-unit values like ¥1 ≈ $0.00667 instead of rounding them to $0.01. */
function formatBaseValue(value: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: BASE,
    ...(value < 1 ? { maximumSignificantDigits: 3 } : {}),
  }).format(value);
}

export default async function CurrenciesPage() {
  const rates = await getExchangeRates(BASE);
  const accepted = new Set(DEFAULT_CURRENCIES);
  // Accepted currencies first, then every other code the rate provider knows about.
  const codes = [
    ...DEFAULT_CURRENCIES,
    ...Object.keys(rates?.rates ?? {}).filter((code) => !accepted.has(code)).sort(),
  ];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 font-sans">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Currency codes &amp; exchange rates</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {rates
          ? `Rates relative to ${BASE}, last updated ${rates.updatedAt}. Indicative only — the final charge uses the currency you pay in.`
          : "Exchange rates are currently unavailable. Currency codes are still listed below."}
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/[.08] dark:border-white/[.145]">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Decimals</th>
              {rates && <th className="px-4 py-3 text-right font-medium">1 {BASE} =</th>}
              {rates && <th className="px-4 py-3 text-right font-medium">1 unit in {BASE}</th>}
              <th className="px-4 py-3 font-medium">Payments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[.06] text-black dark:divide-white/[.1] dark:text-zinc-50">
            {codes.map((code) => {
              const rate = rates?.rates[code];
              return (
                <tr key={code}>
                  <td className="px-4 py-2.5 font-mono font-semibold">{code}</td>
                  <td className="px-4 py-2.5">{currencyName(code, LOCALE)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{currencyDecimals(code)}</td>
                  {rates && (
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {rate ? `${formatRate(rate)} ${code}` : "—"}
                    </td>
                  )}
                  {rates && (
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {rate ? formatBaseValue(1 / rate) : "—"}
                    </td>
                  )}
                  <td className="px-4 py-2.5">
                    {accepted.has(code) ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
                        Accepted
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Rates by <a className="underline" href="https://www.exchangerate-api.com">ExchangeRate-API</a>.
      </p>
    </main>
  );
}
