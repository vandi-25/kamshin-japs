"use client";

import { useSyncExternalStore } from "react";

/**
 * DESIGN PREVIEW cart: kept in the visitor's browser (localStorage) so the preview
 * works with no database. Phase 5 replaces this with the server-side DB cart
 * (guest cookie + user cart, stock/price re-checked on the server).
 */

export type CartLines = Record<string, number>; // product slug -> quantity

const KEY = "kamshin-preview-cart";
const EMPTY: CartLines = {};
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: CartLines } = { raw: null, value: EMPTY };

function read(): CartLines {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cache.value;
  }
  if (raw === cache.raw) return cache.value;
  let value: CartLines = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object") {
      value = Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).filter(
          (entry): entry is [string, number] => Number.isInteger(entry[1]) && (entry[1] as number) > 0,
        ),
      );
    }
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function write(next: CartLines) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // Storage blocked (private mode): keep the cart in memory for this visit.
  }
  cache = { raw, value: next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart(): CartLines {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useCartCount(): number {
  const lines = useCart();
  return Object.values(lines).reduce((sum, qty) => sum + qty, 0);
}

export function addToCart(slug: string, quantity: number, maxStock: number) {
  const current = read();
  const nextQty = Math.min((current[slug] ?? 0) + quantity, maxStock);
  if (nextQty <= 0) return;
  write({ ...current, [slug]: nextQty });
}

export function setCartQuantity(slug: string, quantity: number, maxStock: number) {
  const current = { ...read() };
  const qty = Math.min(Math.max(0, quantity), maxStock);
  if (qty === 0) delete current[slug];
  else current[slug] = qty;
  write(current);
}

export function removeFromCart(slug: string) {
  const current = { ...read() };
  delete current[slug];
  write(current);
}

export function clearCart() {
  write({});
}
