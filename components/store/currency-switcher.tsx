"use client";

import { useTransition } from "react";

import { NativeSelect } from "@/components/ui/native-select";
import { setDisplayCurrency } from "@/lib/actions/currency";
import { currencyName, SUPPORTED_CURRENCIES } from "@/lib/currency";
import { cn } from "@/lib/utils";

import { useMoney } from "./currency-provider";

export function CurrencySwitcher({ className }: { className?: string }) {
  const { selected } = useMoney();
  const [pending, startTransition] = useTransition();

  return (
    <div className={cn("w-[5.75rem]", className)}>
      <NativeSelect
        aria-label="Currency"
        value={selected}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(() => setDisplayCurrency(next));
        }}
        className="h-9 bg-transparent pl-2.5 text-xs tracking-[0.08em]"
      >
        {SUPPORTED_CURRENCIES.map((code) => (
          <option key={code} value={code} title={currencyName(code)}>
            {code}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
