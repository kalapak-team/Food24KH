"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { cuisines, shopTypes } from "@/lib/data";

const schema = z.object({
  businessType: z.enum(["restaurant", "shop"]),
  businessName: z.string().trim().min(2, "Enter the business name").max(100),
  ownerName: z.string().trim().min(2, "Enter the owner's name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+855|0)\d{8,9}$/, "Enter a Cambodian phone number"),
  email: z.string().trim().email("Enter a valid email"),
  category: z.string().min(1, "Choose a category"),
  address: z.string().trim().min(5, "Enter the business address").max(200),
  description: z.string().trim().max(500),
  openingHours: z.string().trim().min(3, "e.g. Daily 08:00 – 22:00").max(80),
});

type Values = z.infer<typeof schema>;

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { businessType: "restaurant", category: "" } });
  const businessType = useWatch({ control, name: "businessType" });
  const categories = businessType === "shop" ? shopTypes : cuisines;
  const inputClass =
    "mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-primary aria-[invalid=true]:border-error";

  const error = (name: keyof Values) =>
    errors[name] && <span className="mt-1 block text-xs text-error">{errors[name]?.message}</span>;

  return (
    <form noValidate onSubmit={handleSubmit(() => setSubmitted(true))} className="space-y-4">
      <fieldset>
        <legend className="text-sm font-semibold">Business type</legend>
        <div className="mt-2 flex gap-2">
          {(["restaurant", "shop"] as const).map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" value={type} {...register("businessType")} className="peer sr-only" />
              <span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold capitalize peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                {type}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Business name</span>
          <input {...register("businessName")} aria-invalid={Boolean(errors.businessName)} className={inputClass} />
          {error("businessName")}
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Owner name</span>
          <input {...register("ownerName")} autoComplete="name" aria-invalid={Boolean(errors.ownerName)} className={inputClass} />
          {error("ownerName")}
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Phone</span>
          <input {...register("phone")} type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} className={inputClass} />
          {error("phone")}
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input {...register("email")} type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={inputClass} />
          {error("email")}
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{businessType === "shop" ? "Shop type" : "Cuisine"}</span>
          <select {...register("category")} aria-invalid={Boolean(errors.category)} className={inputClass}>
            <option value="">Choose…</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          {error("category")}
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Opening hours</span>
          <input {...register("openingHours")} placeholder="Daily 08:00 – 22:00" aria-invalid={Boolean(errors.openingHours)} className={inputClass} />
          {error("openingHours")}
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold">Address</span>
        <input {...register("address")} autoComplete="street-address" aria-invalid={Boolean(errors.address)} className={inputClass} />
        {error("address")}
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Short description</span>
        <textarea {...register("description")} rows={3} className="mt-1 w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-primary" />
      </label>
      <p className="text-xs text-muted">Logo, cover photo and business documents are uploaded after the application is reviewed.</p>
      {submitted && (
        <p className="flex items-start gap-2 rounded-xl bg-primary-soft p-3 text-sm text-primary" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Your application details are valid. Online submission opens when the partner onboarding API is live — nothing has been sent yet.
        </p>
      )}
      <button type="submit" className="h-12 w-full rounded-full bg-primary font-semibold text-white hover:bg-primary-dark sm:w-auto sm:px-8">
        Check application
      </button>
    </form>
  );
}
