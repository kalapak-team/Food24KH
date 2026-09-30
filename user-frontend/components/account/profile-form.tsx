"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { profileStore } from "@/lib/stores";
import type { Profile } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^((\+855|0)\d{8,9})?$/, "Enter a Cambodian phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]),
});

export function ProfileForm() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({
    resolver: zodResolver(schema),
    defaultValues: () => Promise.resolve(profileStore.get()),
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => {
        profileStore.set(values);
        setSaved(true);
      })}
      className="space-y-4 rounded-3xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-bold text-white" aria-hidden>
          👤
        </span>
        <div>
          <h2 className="font-display text-lg font-bold">Profile</h2>
          <p className="text-sm text-muted">Saved on this device until account sign-in is connected.</p>
        </div>
      </div>
      {(
        [
          ["name", "Full name", "name", "text"],
          ["phone", "Phone", "tel", "tel"],
          ["email", "Email", "email", "email"],
        ] as const
      ).map(([name, label, autoComplete, type]) => (
        <label key={name} className="block">
          <span className="text-sm font-semibold">{label}</span>
          <input
            type={type}
            autoComplete={autoComplete}
            {...register(name, { onChange: () => setSaved(false) })}
            aria-invalid={Boolean(errors[name])}
            className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-primary aria-[invalid=true]:border-error"
          />
          {errors[name] && <span className="mt-1 block text-xs text-error">{errors[name]?.message}</span>}
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" className="h-11 rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-dark">
          Save changes
        </button>
        {saved && (
          <span className="text-sm text-success" role="status">
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
