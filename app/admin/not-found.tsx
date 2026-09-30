import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-serif text-7xl text-taupe">404</p>
      <h1 className="mt-2 text-3xl">Not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">That record doesn&apos;t exist or was removed.</p>
      <Button asChild className="mt-6">
        <Link href="/admin">Back to overview</Link>
      </Button>
    </div>
  );
}
