import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="text-xs tracking-[0.22em] text-gold-text uppercase">Not found</p>
      <h1 className="mt-3 text-5xl">This fragrance has moved on</h1>
      <p className="mt-4 text-muted-foreground">
        It may be sold out or no longer part of the collection. Discover something new instead.
      </p>
      <Button asChild className="mt-8 tracking-[0.12em] uppercase">
        <Link href="/products">Browse fragrances</Link>
      </Button>
    </div>
  );
}
