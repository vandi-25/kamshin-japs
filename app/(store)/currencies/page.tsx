import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { currencyDecimals, currencyName, formatMajorUnits, STORE_CURRENCY, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { getExchangeRates } from "@/lib/exchange-rates";

export const metadata: Metadata = { title: "Currencies & exchange rates" };

/** Shows tiny values like ₦1 ≈ $0.000641 instead of rounding them to $0.00. */
function formatSmall(amount: number, currency: string) {
  if (amount >= 0.01) return formatMajorUnits(amount, currency);
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumSignificantDigits: 3,
  }).format(amount);
}

export default async function CurrenciesPage() {
  const rates = await getExchangeRates(STORE_CURRENCY);
  const supported = new Set(SUPPORTED_CURRENCIES);
  // Store currencies first, then every other code the rate provider knows about.
  const codes = [
    ...SUPPORTED_CURRENCIES,
    ...Object.keys(rates?.rates ?? {}).filter((code) => !supported.has(code)).sort(),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs tracking-[0.22em] text-gold-text uppercase">Shop from anywhere</p>
      <h1 className="mt-2 text-5xl">Currencies &amp; exchange rates</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        {rates
          ? `Prices are shown in your local currency for convenience and charged in naira. Rates last updated ${rates.updatedAt}.`
          : "Exchange rates are unavailable right now, so prices are shown in naira. Currency codes are listed below."}
      </p>

      <div className="mt-8 overflow-x-auto rounded-md border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Decimals</th>
              {rates && <th className="px-4 py-3 text-right font-medium">₦1,000 =</th>}
              {rates && <th className="px-4 py-3 text-right font-medium">1 unit =</th>}
              <th className="px-4 py-3 font-medium">Store</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {codes.map((code) => {
              const rate = code === STORE_CURRENCY ? 1 : rates?.rates[code];
              return (
                <tr key={code}>
                  <td className="px-4 py-2.5 font-mono font-semibold">{code}</td>
                  <td className="px-4 py-2.5">{currencyName(code)}</td>
                  <td className="px-4 py-2.5 tabular-nums">{currencyDecimals(code)}</td>
                  {rates && (
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {rate ? formatSmall(1000 * rate, code) : "—"}
                    </td>
                  )}
                  {rates && (
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {rate ? formatSmall(1 / rate, STORE_CURRENCY) : "—"}
                    </td>
                  )}
                  <td className="px-4 py-2.5">
                    {supported.has(code) ? <Badge variant="success">Supported</Badge> : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Rates by{" "}
        <a className="underline" href="https://www.exchangerate-api.com">
          ExchangeRate-API
        </a>
        .
      </p>
    </div>
  );
}
