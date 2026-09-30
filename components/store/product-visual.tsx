import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

import { BottleArt } from "./bottle-art";

/** Framed product image area. Uses bottle art until real photos are uploaded. */
export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] items-end justify-center overflow-hidden bg-gradient-to-b from-[#f6efe7] to-[#ebdfd2] p-[12%]",
        className,
      )}
    >
      <BottleArt tone={product.tone} shape={product.bottle} name={product.name} />
    </div>
  );
}
