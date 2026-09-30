"use client";

import { useCartCount } from "@/lib/demo/cart-store";

export function CartCount() {
  const count = useCartCount();
  return (
    <>
      <span className="sr-only">Shopping bag, {count} {count === 1 ? "item" : "items"}</span>
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -top-1 -right-1 grid min-w-4.5 place-items-center rounded-full bg-gold px-1 text-[10px] leading-4.5 font-semibold text-burgundy"
        >
          {count}
        </span>
      )}
    </>
  );
}
