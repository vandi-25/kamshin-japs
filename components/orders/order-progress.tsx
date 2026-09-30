import { Check } from "lucide-react";

import type { OrderStatus } from "@/lib/demo/orders";
import { cn } from "@/lib/utils";

const steps: { status: OrderStatus; label: string }[] = [
  { status: "PAID", label: "Paid" },
  { status: "PROCESSING", label: "Preparing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

export function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED" || status === "PENDING") return null;
  const current = steps.findIndex((s) => s.status === status);
  return (
    <ol className="grid grid-cols-4" aria-label="Order progress">
      {steps.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step.status} className="relative flex flex-col items-center text-center" aria-current={i === current ? "step" : undefined}>
            {i > 0 && (
              <span aria-hidden className={cn("absolute top-4 right-1/2 h-0.5 w-full", i <= current ? "bg-burgundy" : "bg-border")} />
            )}
            <span
              className={cn(
                "relative z-10 grid size-8 place-items-center rounded-full border-2 bg-card text-xs",
                done ? "border-burgundy bg-burgundy text-ivory" : "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : i + 1}
            </span>
            <span className={cn("mt-2 text-xs", done ? "text-foreground" : "text-muted-foreground")}>
              {step.label}
              <span className="sr-only">{done ? " (done)" : " (upcoming)"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
