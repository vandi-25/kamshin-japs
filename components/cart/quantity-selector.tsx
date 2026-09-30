"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  max,
  label,
  size = "default",
}: {
  value: number;
  onChange: (value: number) => void;
  max: number;
  label: string;
  size?: "default" | "sm";
}) {
  const btn = cn(
    "grid place-items-center text-foreground transition-colors hover:bg-accent disabled:opacity-40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
    size === "sm" ? "size-8" : "size-11",
  );
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-md border border-input bg-card">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <output aria-live="polite" className={cn("text-center tabular-nums", size === "sm" ? "w-8 text-sm" : "w-10")}>
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
