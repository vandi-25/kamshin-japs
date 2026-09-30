import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";

import { Wordmark } from "@/components/brand/wordmark";
import { CartCount } from "@/components/cart/cart-count";

import { MobileNav } from "./mobile-nav";
import { storeNav } from "./nav-links";

const iconLink =
  "relative grid size-10 place-items-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-burgundy focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-20">
        <div className="flex items-center gap-1">
          <MobileNav />
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {storeNav.slice(0, 3).map((item) => (
              <Link key={item.href} href={item.href} className="text-xs tracking-[0.16em] uppercase hover:text-burgundy">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" aria-label="Kamshin home" className="rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
          <Wordmark className="text-xl lg:text-2xl" />
        </Link>

        <div className="flex items-center justify-end gap-1">
          <nav aria-label="Collections" className="mr-4 hidden items-center gap-7 xl:flex">
            {storeNav.slice(3).map((item) => (
              <Link key={item.href} href={item.href} className="text-xs tracking-[0.16em] uppercase hover:text-burgundy">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/products" className={iconLink} aria-label="Search fragrances">
            <Search className="size-5" />
          </Link>
          <Link href="/login" className={`${iconLink} hidden sm:grid`} aria-label="Sign in">
            <User className="size-5" />
          </Link>
          <Link href="/cart" className={iconLink}>
            <ShoppingBag className="size-5" aria-hidden />
            <CartCount />
          </Link>
        </div>
      </div>
    </header>
  );
}
