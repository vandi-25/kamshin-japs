"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { storeNav } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent side="left" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <Wordmark className="text-xl" />
        <nav aria-label="Mobile" className="mt-10 flex flex-col">
          {storeNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b py-4 font-serif text-2xl text-foreground hover:text-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-3 text-sm">
          <Link href="/account/orders" onClick={() => setOpen(false)} className="hover:text-burgundy">
            My orders
          </Link>
          <Link href="/login" onClick={() => setOpen(false)} className="hover:text-burgundy">
            Sign in
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)} className="hover:text-burgundy">
            Create account
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
