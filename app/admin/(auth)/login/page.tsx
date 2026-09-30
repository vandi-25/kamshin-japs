import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { Wordmark } from "@/components/brand/wordmark";

export const metadata: Metadata = { title: "Admin Sign In" };

export default function AdminLoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center bg-burgundy px-4 py-16">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(212,175,55,0.18),transparent_60%)]" />
      <div className="relative w-full max-w-md rounded-md bg-card p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <Wordmark />
          <p className="mt-2 text-[10px] tracking-[0.3em] text-gold-text uppercase">Admin</p>
          <h1 className="mt-6 text-3xl">Sign in to the dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Admin accounts only.</p>
        </div>
        <div className="mt-8">
          <LoginForm redirectTo="/admin" variant="admin" />
        </div>
      </div>
    </div>
  );
}
