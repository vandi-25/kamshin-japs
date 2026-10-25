"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useId, useState } from "react";

import { useMoney } from "@/components/store/currency-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import {
  convertMinorUnits,
  currencyDecimals,
  currencyName,
  formatMajorUnits,
  formatMinorUnits,
  STORE_CURRENCY,
  SUPPORTED_CURRENCIES,
  toMinorUnits,
  type CurrencyCode,
  type PaymentRequest,
} from "@/lib/currency";

type Props = {
  /** Called with the validated amount; the server action performs the actual charge. */
  payAction: (request: PaymentRequest) => Promise<void>;
  currencies?: CurrencyCode[];
  /** Defaults to the visitor's display currency (from their location or choice), else naira. */
  defaultCurrency?: CurrencyCode;
  /** Optional minimum charge, in major units of any currency (e.g. 1 = ₦1 / $1). */
  minAmount?: number;
};

export function CurrencyPayment({ payAction, currencies = SUPPORTED_CURRENCIES, defaultCurrency, minAmount = 0 }: Props) {
  const id = useId();
  const money = useMoney();
  const [currency, setCurrency] = useState(
    defaultCurrency ?? (currencies.includes(money.selected) ? money.selected : STORE_CURRENCY),
  );
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "paying" | "paid" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const decimals = currencyDecimals(currency);
  const amountMinor = toMinorUnits(input, currency);
  const belowMinimum = amountMinor !== null && amountMinor < minAmount * 10 ** decimals;
  const valid = amountMinor !== null && amountMinor > 0 && !belowMinimum;
  // Non-naira payments also show the naira equivalent, since that's the store's own currency.
  const inNaira =
    valid && currency !== STORE_CURRENCY && money.rates
      ? convertMinorUnits(amountMinor!, currency, STORE_CURRENCY, money.rates)
      : null;

  let hint: string | null = null;
  if (input && amountMinor === null) {
    hint =
      decimals === 0
        ? `${currency} doesn't use decimals — enter a whole number.`
        : `Enter a number with up to ${decimals} decimal places.`;
  } else if (belowMinimum) {
    hint = `Minimum is ${formatMinorUnits(minAmount * 10 ** decimals, currency)}.`;
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-5 rounded-md border bg-card p-6">
      <div className="space-y-2">
        <Label htmlFor={`${id}-amount`}>Amount</Label>
        <div className="flex gap-2">
          <Input
            id={`${id}-amount`}
            inputMode={decimals === 0 ? "numeric" : "decimal"}
            autoComplete="off"
            placeholder={decimals === 0 ? "0" : `0.${"0".repeat(decimals)}`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus("idle");
            }}
            aria-invalid={hint !== null}
            aria-describedby={`${id}-hint`}
          />
          <div className="w-28 shrink-0">
            <NativeSelect
              aria-label="Currency"
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setStatus("idle");
              }}
            >
              {currencies.map((code) => (
                <option key={code} value={code} title={currencyName(code)}>
                  {code}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <p id={`${id}-hint`} className="min-h-5 text-sm text-destructive">
          {hint}
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">{currencyName(currency)}</span>
          <span className="text-xl font-medium">{valid ? formatMinorUnits(amountMinor!, currency) : "—"}</span>
        </div>
        {inNaira !== null && (
          <p className="text-right text-xs text-muted-foreground">≈ {formatMajorUnits(inNaira, STORE_CURRENCY)}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={!valid || status === "paying"} className="tracking-[0.12em] uppercase">
        <Lock aria-hidden />
        {status === "paying" ? "Processing…" : valid ? `Pay ${formatMinorUnits(amountMinor!, currency)}` : "Pay"}
      </Button>

      <p role="status" className="min-h-5 text-sm">
        {status === "paid" && <span className="text-green-700">Payment submitted.</span>}
        {status === "error" && <span className="text-destructive">{error}</span>}
      </p>

      <Link
        href="/currencies"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-burgundy underline-offset-4 hover:underline"
      >
        View currency codes &amp; exchange rates ↗
      </Link>
    </form>
  );
}
