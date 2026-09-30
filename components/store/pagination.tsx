import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  page: number;
  pageCount: number;
  /** Builds the href for a given page, keeping other search params. */
  hrefFor: (page: number) => string;
};

export function Pagination({ page, pageCount, hrefFor }: Props) {
  if (pageCount <= 1) return null;
  const item =
    "grid size-10 place-items-center rounded-md border text-sm transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";
  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={item} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(item, "pointer-events-none opacity-40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(item, n === page && "border-burgundy bg-burgundy text-ivory hover:bg-burgundy")}
        >
          {n}
        </Link>
      ))}
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} className={item} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(item, "pointer-events-none opacity-40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
