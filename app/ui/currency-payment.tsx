"use client";

import { useId, useState } from "react";

import {
  DEFAULT_CURRENCIES,
  currencyDecimals,
  formatMinorUnits,
  toMinorUnits,
  type CurrencyCode,
  type PaymentRequest,
} from "@/app/lib/currency";

function currencyName(currency: CurrencyCode, locale: string): string {
  return new Intl.DisplayNames([locale], { type: "currency" }).of(currency) ?? currency;
}

type Props = {
  /** Called with the validated amount; perform the actual charge here (e.g. via your provider's server API). */
  payAction: (request: PaymentRequest) => Promise<void> | void;
  currencies?: CurrencyCode[];
  defaultCurrency?: CurrencyCode;
  /** Fixed for consistent server/client rendering; pass the user's locale if you know it. */
  locale?: string;
  /** Optional minimum charge, in major units of any currency (e.g. 1 = $1.00 / ¥1). */
  minAmount?: number;
};

export default function CurrencyPayment({
  payAction,
  currencies = DEFAULT_CURRENCIES,
  defaultCurrency = currencies[0],
  locale = "en-US",
  minAmount = 0,
}: Props) {
  const id = useId();
  const [currency, setCurrency] = useState(defaultCurrency);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "paying" | "paid" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const decimals = currencyDecimals(currency);
  const amountMinor = toMinorUnits(input, currency);
  const belowMinimum = amountMinor !== null && amountMinor < minAmount * 10 ** decimals;
  const valid = amountMinor !== null && amountMinor > 0 && !belowMinimum;

  let hint: string | null = null;
  if (input && amountMinor === null) {
    hint = decimals === 0
      ? `${currency} doesn't use decimals — enter a whole number.`
      : `Enter a number with up to ${decimals} decimal places.`;
  } else if (belowMinimum) {
    hint = `Minimum is ${formatMinorUnits(minAmount * 10 ** decimals, currency, locale)}.`;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || status === "paying") return;
    setStatus("paying");
    setError(null);
    try {
      await payAction({ amountMinor: amountMinor!, currency });
      setStatus("paid");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950"
    >
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">Payment</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-amount`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Amount
        </label>
        <div className="flex overflow-hidden rounded-lg border border-black/[.12] focus-within:ring-2 focus-within:ring-zinc-400 dark:border-white/[.2]">
          <input
            id={`${id}-amount`}
            inputMode={decimals === 0 ? "numeric" : "decimal"}
            autoComplete="off"
            placeholder={decimals === 0 ? "0" : `0.${"0".repeat(decimals)}`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value.replace(",", "."));
              setStatus("idle");
            }}
            aria-invalid={hint !== null}
            aria-describedby={`${id}-hint`}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-black outline-none dark:text-zinc-50"
          />
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              setStatus("idle");
            }}
            className="border-l border-black/[.12] bg-zinc-50 px-2 text-sm text-black outline-none dark:border-white/[.2] dark:bg-zinc-900 dark:text-zinc-50"
          >
            {currencies.map((code) => (
              <option key={code} value={code} title={currencyName(code, locale)}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <p id={`${id}-hint`} className="min-h-5 text-sm text-red-600 dark:text-red-400">
          {hint}
        </p>
      </div>

      <div className="flex items-baseline justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>{currencyName(currency, locale)}</span>
        <span className="text-base font-semibold text-black dark:text-zinc-50">
          {valid ? formatMinorUnits(amountMinor!, currency, locale) : "—"}
        </span>
      </div>

      <button
        type="submit"
        disabled={!valid || status === "paying"}
        className="h-11 rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {status === "paying"
          ? "Processing…"
          : valid
            ? `Pay ${formatMinorUnits(amountMinor!, currency, locale)}`
            : "Pay"}
      </button>

      <p role="status" className="text-sm">
        {status === "paid" && <span className="text-green-700 dark:text-green-400">Payment submitted.</span>}
        {status === "error" && <span className="text-red-600 dark:text-red-400">{error}</span>}
      </p>
    </form>
  );
}
