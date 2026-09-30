"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your email or phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(80),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .regex(/^(\+855|0)\d{8,9}$/, "Enter a Cambodian phone number"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/\d/, "Include a number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value, "Please accept the terms"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type Mode = "login" | "register";
type Values = z.infer<typeof loginSchema> & Partial<z.infer<typeof registerSchema>>;

export function AuthForm({ mode }: { mode: Mode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema) as never,
    defaultValues: { terms: false } as Values,
  });

  const input = (name: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        {...register(name)}
        {...props}
        aria-invalid={Boolean(errors[name])}
        className="mt-1 h-12 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-primary aria-[invalid=true]:border-error"
      />
      {errors[name] && <span className="mt-1 block text-xs text-error">{String(errors[name]?.message)}</span>}
    </label>
  );

  return (
    <form noValidate onSubmit={handleSubmit(() => setNotice(true))} className="space-y-4">
      {mode === "register" && input("name", "Full name", { autoComplete: "name" })}
      {mode === "login"
        ? input("identifier", "Email or phone", { autoComplete: "username" })
        : (
          <>
            {input("email", "Email", { type: "email", autoComplete: "email" })}
            {input("phone", "Phone", { type: "tel", autoComplete: "tel", placeholder: "012 345 678" })}
          </>
        )}
      <div className="relative">
        {input("password", "Password", {
          type: showPassword ? "text" : "password",
          autoComplete: mode === "login" ? "current-password" : "new-password",
        })}
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-2 top-7 grid h-10 w-10 place-items-center rounded-full text-muted hover:text-primary"
        >
          {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      {mode === "register" && (
        <>
          {input("confirmPassword", "Confirm password", { type: showPassword ? "text" : "password", autoComplete: "new-password" })}
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" {...register("terms")} className="mt-0.5 h-5 w-5 rounded accent-[var(--primary)]" />
            <span>
              I agree to the{" "}
              <Link href="/info/terms" className="font-semibold text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/info/privacy" className="font-semibold text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && <span className="block text-xs text-error">{String(errors.terms.message)}</span>}
        </>
      )}

      {notice && (
        <p className="flex items-start gap-2 rounded-xl bg-primary-soft p-3 text-sm text-primary" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Your details look good. Secure sign-in is being connected to the Food24KH API — accounts are not created yet.
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full bg-primary font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
        {mode === "login" ? "Log in" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "login" ? "New to Food24KH? " : "Already have an account? "}
        <Link href={mode === "login" ? "/register" : "/login"} className="font-semibold text-primary hover:underline">
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
