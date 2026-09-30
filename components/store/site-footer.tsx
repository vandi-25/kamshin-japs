import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";

import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All fragrances" },
      { href: "/products?category=for-her", label: "For Her" },
      { href: "/products?category=for-him", label: "For Him" },
      { href: "/products?category=oud-oriental", label: "Oud & Oriental" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
      { href: "/account/orders", label: "My orders" },
      { href: "/cart", label: "Shopping bag" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-burgundy text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-5">
          <Wordmark tone="ivory" />
          <p className="max-w-sm text-sm leading-relaxed text-ivory/75">
            Fine fragrances, thoughtfully chosen. Delivered across Nigeria with care.
          </p>
          <NewsletterForm tone="dark" />
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="font-sans text-xs tracking-[0.2em] text-gold uppercase">{col.title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ivory/80 hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/15">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-ivory/60 sm:px-6">
          © {new Date().getFullYear()} Kamshin. All rights reserved. Prices in Naira (₦).
        </p>
      </div>
    </footer>
  );
}
