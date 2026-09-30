import { CircleAlert, CircleCheck, CircleX } from "lucide-react";

import { cn } from "@/lib/utils";

export const LOW_STOCK_THRESHOLD = 5;

/** Stock state always pairs an icon with a label, never colour alone. */
export function StockStatus({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <p className={cn("flex items-center gap-1.5 text-sm text-destructive", className)}>
        <CircleX className="size-4" aria-hidden /> Sold out
      </p>
    );
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <p className={cn("flex items-center gap-1.5 text-sm text-warning", className)}>
        <CircleAlert className="size-4" aria-hidden /> Only {stock} left
      </p>
    );
  }
  return (
    <p className={cn("flex items-center gap-1.5 text-sm text-success", className)}>
      <CircleCheck className="size-4" aria-hidden /> In stock
    </p>
  );
}
