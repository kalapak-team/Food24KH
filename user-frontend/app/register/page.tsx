import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Free delivery offers on your first order from selected partners.">
      <AuthForm mode="register" />
    </AuthShell>
  );
}
