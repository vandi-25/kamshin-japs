"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/demo/cart-store";

import { QuantitySelector } from "./quantity-selector";

export function AddToCart({ slug, name, stock }: { slug: string; name: string; stock: number }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  if (stock <= 0) {
    return (
      <Button size="lg" variant="secondary" disabled className="w-full sm:w-auto">
        Sold out
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <QuantitySelector value={quantity} onChange={setQuantity} max={stock} label="Quantity" />
      <Button
        size="lg"
        className="flex-1 tracking-[0.12em] uppercase"
        onClick={() => {
          addToCart(slug, quantity, stock);
          toast.success(`${name} added to your bag`, {
            action: { label: "View bag", onClick: () => router.push("/cart") },
          });
        }}
      >
        <ShoppingBag aria-hidden /> Add to bag
      </Button>
      <Link href="/cart" className="sr-only focus:not-sr-only">
        Go to bag
      </Link>
    </div>
  );
}
