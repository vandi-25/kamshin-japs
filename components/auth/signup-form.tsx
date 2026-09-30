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
import { PASSWORD_MIN_LENGTH } from "@/lib/password-rules";
import { signupSchema, type SignupInput } from "@/lib/validation/auth";

export function SignupForm() {
  const router = useRouter();
  const form = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success(`Welcome to Kamshin, ${data.name.split(" ")[0]}`, {
      description: "Design preview — no account was created.",
    });
    router.push("/products");
  });

  const field = (
    id: keyof SignupInput,
    label: string,
    type: string,
    autoComplete: string,
    hint?: string,
  ) => (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className="mt-2"
        aria-invalid={!!errors[id]}
        aria-describedby={`${id}-error ${id}-hint`}
        {...form.register(id)}
      />
      {hint && !errors[id] && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={errors[id]?.message} />
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {field("name", "Full name", "text", "name")}
      {field("email", "Email", "email", "email")}
      {field("password", "Password", "password", "new-password", `At least ${PASSWORD_MIN_LENGTH} characters`)}
      {field("confirmPassword", "Confirm password", "password", "new-password")}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full tracking-[0.14em] uppercase">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-burgundy underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
