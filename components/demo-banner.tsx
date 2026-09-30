import { Sparkles } from "lucide-react";

/** Shown on every page of the design preview so nobody mistakes it for the live shop. */
export function DemoBanner() {
  return (
    <div className="bg-gold px-4 py-1.5 text-center text-xs font-medium text-burgundy">
      <Sparkles className="mr-1.5 inline size-3.5 align-[-2px]" aria-hidden />
      Design preview · sample products and data · payments and accounts are not live yet
    </div>
  );
}
