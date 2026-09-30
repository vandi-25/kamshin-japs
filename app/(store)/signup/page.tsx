import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Save addresses, check out in seconds and follow every order.">
      <SignupForm />
    </AuthShell>
  );
}
