"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddressForm } from "@/components/address/address-form";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteAddress, formatAddress, saveAddress, setDefaultAddress } from "@/lib/addresses";
import { useStore } from "@/lib/store";
import { addressesStore } from "@/lib/stores";

export function AddressesView() {
  const addresses = useStore(addressesStore);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const current = addresses.find((address) => address.id === editing);

  if (editing) {
    return (
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold">{editing === "new" ? "Add address" : "Edit address"}</h2>
        <AddressForm
          key={editing}
          initial={current}
          onCancel={() => setEditing(null)}
          onSubmit={(values) => {
            saveAddress(values, current?.id);
            setEditing(null);
          }}
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Saved addresses</h2>
        <button type="button" onClick={() => setEditing("new")} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" aria-hidden /> Add address
        </button>
      </div>
      {addresses.length === 0 ? (
        <EmptyState emoji="📍" title="No saved addresses" text="Add your home or work address for faster checkout." />
      ) : (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-wrap items-start gap-4 rounded-2xl border border-border bg-card p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
              <div className="min-w-0 flex-1 text-sm">
                <p className="flex items-center gap-2 font-semibold">
                  {address.label}
                  {address.isDefault && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] text-primary">Default</span>}
                </p>
                <p className="mt-1 text-muted">{formatAddress(address)}</p>
                <p className="text-muted">
                  {address.recipientName} · {address.phone}
                </p>
              </div>
              <div className="flex gap-1">
                {!address.isDefault && (
                  <button type="button" onClick={() => setDefaultAddress(address.id)} aria-label={`Set ${address.label} as default`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-soft">
                    <Star className="h-4 w-4" aria-hidden />
                  </button>
                )}
                <button type="button" onClick={() => setEditing(address.id)} aria-label={`Edit ${address.label}`} className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-soft">
                  <Pencil className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => window.confirm("Delete this address?") && deleteAddress(address.id)}
                  aria-label={`Delete ${address.label}`}
                  className="grid h-10 w-10 place-items-center rounded-full text-error hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
