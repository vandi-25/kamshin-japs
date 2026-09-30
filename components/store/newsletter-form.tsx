"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <form
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        e.currentTarget.reset();
        toast.success("Thank you — you're on the list", { description: "Design preview: no email was sent." });
      }}
    >
      <label htmlFor={`newsletter-${tone}`} className="sr-only">
        Email address
      </label>
      <Input
        id={`newsletter-${tone}`}
        type="email"
        required
        placeholder="Your email address"
        className={tone === "dark" ? "border-ivory/25 bg-transparent text-ivory placeholder:text-ivory/60" : ""}
      />
      <Button type="submit" variant={tone === "dark" ? "gold" : "default"} className="h-10 tracking-[0.12em] uppercase">
        Subscribe
      </Button>
    </form>
  );
}
