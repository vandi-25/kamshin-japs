"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export function LoginForm({ redirectTo, variant = "store" }: { redirectTo: string; variant?: "store" | "admin" }) {
  const router = useRouter();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success(variant === "admin" ? "Welcome back" : "Signed in", {
      description: "Design preview — sign-in isn't connected yet.",
    });
    router.push(redirectTo);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" className="mt-2" aria-invalid={!!errors.email} aria-describedby="email-error" {...form.register("email")} />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {variant === "store" && (
            <span className="text-xs text-muted-foreground">Forgot password? (coming soon)</span>
          )}
        </div>
        <Input id="password" type="password" autoComplete="current-password" className="mt-2" aria-invalid={!!errors.password} aria-describedby="password-error" {...form.register("password")} />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full tracking-[0.14em] uppercase">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      {variant === "store" && (
        <p className="text-center text-sm text-muted-foreground">
          New to Kamshin?{" "}
          <Link href="/signup" className="text-burgundy underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      )}
    </form>
  );
}
