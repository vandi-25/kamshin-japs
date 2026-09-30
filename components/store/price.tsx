import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function Price({
  priceKobo,
  compareAtPriceKobo,
  className,
}: {
  priceKobo: number;
  compareAtPriceKobo?: number | null;
  className?: string;
}) {
  const onSale = compareAtPriceKobo != null && compareAtPriceKobo > priceKobo;
  return (
    <p className={cn("flex items-baseline gap-2", className)}>
      <span className="font-medium text-foreground">{formatNaira(priceKobo)}</span>
      {onSale && (
        <s className="text-sm text-muted-foreground">
          <span className="sr-only">Was </span>
          {formatNaira(compareAtPriceKobo)}
        </s>
      )}
    </p>
  );
}
