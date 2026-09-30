"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNaira, koboToNairaInput } from "@/lib/money";
import { quickEditSchema } from "@/lib/validation/product";

/** Inline price + stock editor for a products-table row. */
export function QuickEdit({ name, priceKobo, stock }: { name: string; priceKobo: number; stock: number }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({ price: priceKobo, stock });
  const [draft, setDraft] = useState({ price: koboToNairaInput(priceKobo), stock: String(stock) });
  const [error, setError] = useState<string | null>(null);

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="w-28 tabular-nums">{formatNaira(values.price)}</span>
        <span className={`w-16 tabular-nums ${values.stock === 0 ? "text-destructive" : values.stock <= 5 ? "text-warning" : ""}`}>
          {values.stock}
        </span>
        <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)} aria-label={`Quick edit price and stock for ${name}`}>
          <Pencil />
        </Button>
      </div>
    );
  }

  const save = () => {
    const parsed = quickEditSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the values");
      return;
    }
    setValues({ price: parsed.data.price, stock: parsed.data.stock });
    setEditing(false);
    setError(null);
    toast.success(`${name} updated`, { description: "Design preview — changes aren't saved yet." });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`price-${name}`}>Price in naira</label>
        <Input
          id={`price-${name}`}
          value={draft.price}
          onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
          inputMode="decimal"
          className="h-8 w-28"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
        <label className="sr-only" htmlFor={`stock-${name}`}>Stock</label>
        <Input
          id={`stock-${name}`}
          value={draft.stock}
          onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))}
          inputMode="numeric"
          className="h-8 w-16"
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
        <Button size="icon-sm" onClick={save} aria-label="Save">
          <Check />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Cancel"
          onClick={() => {
            setEditing(false);
            setError(null);
            setDraft({ price: koboToNairaInput(values.price), stock: String(values.stock) });
          }}
        >
          <X />
        </Button>
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
