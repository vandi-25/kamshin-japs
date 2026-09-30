"use client";

import { useState } from "react";

import type { BottleShape } from "@/lib/demo/catalog";
import { cn } from "@/lib/utils";

import { BottleArt } from "./bottle-art";

const views = [
  { label: "Front", bg: "from-[#f6efe7] to-[#ebdfd2]", art: "" },
  { label: "Angle", bg: "from-[#efe3d6] to-[#dccbb9]", art: "-rotate-6 scale-95" },
  { label: "Detail", bg: "from-[#f3e5e2] to-[#e3cfc9]", art: "scale-[1.6] translate-y-[18%]" },
] as const;

/** Image gallery. Shows bottle art views until real product photos are uploaded. */
export function ProductGallery({ name, tone, shape }: { name: string; tone: string; shape: BottleShape }) {
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div role="tablist" aria-label="Product images" className="flex gap-3 sm:flex-col">
        {views.map((v, i) => (
          <button
            key={v.label}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-label={`${v.label} view`}
            onClick={() => setActive(i)}
            className={cn(
              "flex aspect-[4/5] w-20 items-end justify-center overflow-hidden rounded-md border-2 bg-gradient-to-b p-2 transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none",
              v.bg,
              i === active ? "border-burgundy" : "border-transparent hover:border-taupe",
            )}
          >
            <div className={cn("h-full w-full", v.art)}>
              <BottleArt tone={tone} shape={shape} />
            </div>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        className={cn("flex aspect-[4/5] flex-1 items-end justify-center overflow-hidden rounded-md bg-gradient-to-b p-[14%]", view.bg)}
      >
        <div className={cn("h-full w-full transition-transform duration-500", view.art)}>
          <BottleArt tone={tone} shape={shape} name={`${name}, ${view.label.toLowerCase()} view`} />
        </div>
      </div>
    </div>
  );
}
