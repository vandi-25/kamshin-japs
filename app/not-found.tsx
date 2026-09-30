import Link from "next/link";

import { DemoBanner } from "@/components/demo-banner";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <DemoBanner />
      <SiteHeader />
      <main id="main" className="flex-1">
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-serif text-8xl text-taupe">404</p>
      <h1 className="mt-2 text-4xl">Page not found</h1>
      <p className="mt-4 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Button asChild className="mt-8 tracking-[0.12em] uppercase">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
      </main>
      <SiteFooter />
    </>
  );
}
