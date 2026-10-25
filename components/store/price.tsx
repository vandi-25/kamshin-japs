"use client";

import { cn } from "@/lib/utils";

import { useMoney } from "./currency-provider";

export function Price({
  priceKobo,
  compareAtPriceKobo,
  className,
}: {
  priceKobo: number;
  compareAtPriceKobo?: number | null;
  className?: string;
}) {
  const { format, formatNaira, isConverted } = useMoney();
  const onSale = compareAtPriceKobo != null && compareAtPriceKobo > priceKobo;
  return (
    <span className={cn("flex flex-col", className)}>
      <span className="flex items-baseline gap-2">
        <span className="font-medium text-foreground">{format(priceKobo)}</span>
        {onSale && (
          <s className="text-[0.85em] text-muted-foreground">
            <span className="sr-only">Was </span>
            {format(compareAtPriceKobo)}
          </s>
        )}
      </span>
      {isConverted && (
        <span className="text-xs text-muted-foreground">
          <span className="sr-only">Charged as </span>
          {formatNaira(priceKobo)}
        </span>
      )}
    </span>
  );
}
