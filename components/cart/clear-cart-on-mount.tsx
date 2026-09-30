"use client";

import { useEffect } from "react";

import { clearCart } from "@/lib/demo/cart-store";

export function ClearCartOnMount() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
