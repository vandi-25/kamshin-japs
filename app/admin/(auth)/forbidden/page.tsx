import type { Metadata } from "next";
import Link from "next/link";
import { ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Access Denied" };

/** 403 page: a signed-in customer who tries to open the admin lands here. */
export default function ForbiddenPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <ShieldX className="size-12 text-burgundy" aria-hidden strokeWidth={1.25} />
      <p className="mt-6 text-xs tracking-[0.22em] text-gold-text uppercase">Error 403</p>
      <h1 className="mt-2 text-5xl">Access denied</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        This area is for Kamshin administrators only. If you think you should have access, ask an
        existing admin to upgrade your account.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild className="tracking-[0.12em] uppercase">
          <Link href="/admin/login">Sign in as admin</Link>
        </Button>
        <Button asChild variant="outline" className="tracking-[0.12em] uppercase">
          <Link href="/">Go to store</Link>
        </Button>
      </div>
    </div>
  );
}
