"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Address } from "@/types";

const addressSchema = z.object({
  label: z.enum(["Home", "Work", "Other"]),
  recipientName: z.string().trim().min(2, "Enter the recipient's name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+855|0)\d{8,9}$/, "Enter a Cambodian phone number, e.g. 012345678 or +85512345678"),
  province: z.string().trim().min(2, "Enter a province").max(60),
  city: z.string().trim().min(2, "Enter a city").max(60),
  district: z.string().trim().min(2, "Enter a district (khan)").max(60),
  commune: z.string().trim().max(60),
  street: z.string().trim().min(1, "Enter a street").max(100),
  houseNumber: z.string().trim().max(30),
  additionalInfo: z.string().trim().max(200),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

const emptyAddress: AddressFormValues = {
  label: "Home",
  recipientName: "",
  phone: "",
  province: "Phnom Penh",
  city: "Phnom Penh",
  district: "",
  commune: "",
  street: "",
  houseNumber: "",
  additionalInfo: "",
  isDefault: true,
};

type AddressFormProps = {
  initial?: Address;
  onSubmit: (values: AddressFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function AddressForm({ initial, onSubmit, onCancel, submitLabel = "Save address" }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial ?? emptyAddress,
  });

  const field = (name: keyof AddressFormValues, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        {...register(name)}
        {...props}
        aria-invalid={Boolean(errors[name])}
        className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary aria-[invalid=true]:border-error"
      />
      {errors[name] && <span className="mt-1 block text-xs text-error">{errors[name]?.message}</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <fieldset>
        <legend className="text-sm font-semibold">Label</legend>
        <div className="mt-2 flex gap-2">
          {(["Home", "Work", "Other"] as const).map((label) => (
            <label key={label} className="cursor-pointer">
              <input type="radio" value={label} {...register("label")} className="peer sr-only" />
              <span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("recipientName", "Recipient name", { autoComplete: "name" })}
        {field("phone", "Phone", { autoComplete: "tel", inputMode: "tel", placeholder: "012 345 678" })}
        {field("houseNumber", "House number", { placeholder: "e.g. 41B" })}
        {field("street", "Street", { autoComplete: "address-line1", placeholder: "e.g. St. 41" })}
        {field("commune", "Commune (sangkat)")}
        {field("district", "District (khan)")}
        {field("city", "City")}
        {field("province", "Province")}
      </div>
      <label className="block">
        <span className="text-sm font-semibold">Additional information</span>
        <textarea
          {...register("additionalInfo")}
          rows={2}
          placeholder="Landmark, floor, gate colour…"
          className="mt-1 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" {...register("isDefault")} className="h-5 w-5 rounded accent-[var(--primary)]" />
        Set as default address
      </label>
      <p className="text-xs text-muted">Map pin selection will be available when location services are connected.</p>
      <div className="flex gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-12 flex-1 rounded-full border border-border font-semibold hover:border-primary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting} className="h-12 flex-1 rounded-full bg-primary font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
