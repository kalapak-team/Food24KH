"use client";

import { appConfig } from "@/lib/config";
import { useStore } from "@/lib/store";
import { preferencesStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { Currency, Locale } from "@/types";

function Choice<T extends string>({ value, current, onSelect, label, hint }: { value: T; current: T; onSelect: (value: T) => void; label: string; hint: string }) {
  return (
    <button
      type="button"
      aria-pressed={current === value}
      onClick={() => onSelect(value)}
      className={cn("flex-1 rounded-2xl border p-4 text-left", current === value ? "border-primary bg-primary-soft" : "border-border hover:border-primary")}
    >
      <span className="block font-semibold">{label}</span>
      <span className="text-sm text-muted">{hint}</span>
    </button>
  );
}

export function SettingsView() {
  const preferences = useStore(preferencesStore);
  const setLocale = (locale: Locale) => preferencesStore.set((previous) => ({ ...previous, locale }));
  const setCurrency = (currency: Currency) => preferencesStore.set((previous) => ({ ...previous, currency }));

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Language · ភាសា</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Choice value="en" current={preferences.locale} onSelect={setLocale} label="English" hint="Use English across Food24KH" />
          <Choice value="km" current={preferences.locale} onSelect={setLocale} label="ខ្មែរ" hint="ប្រើភាសាខ្មែរ" />
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Currency</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Choice value="USD" current={preferences.currency} onSelect={setCurrency} label="US Dollar ($)" hint="e.g. $3.50" />
          <Choice value="KHR" current={preferences.currency} onSelect={setCurrency} label="Khmer Riel (៛)" hint={`Rate: ៛${appConfig.khrPerUsd.toLocaleString()} per $1`} />
        </div>
      </section>
      <section id="payments" className="scroll-mt-40 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Payment methods</h2>
        <p className="mt-2 text-sm text-muted">
          Cash on delivery is available now. KHQR, ABA, ACLEDA and Wing will appear here once the payment providers are connected on the server.
        </p>
      </section>
      <section id="notifications" className="scroll-mt-40 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Notifications</h2>
        <p className="mt-2 text-sm text-muted">Order and promotion notifications will be enabled together with account sign-in.</p>
      </section>
      <section id="security" className="scroll-mt-40 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Security</h2>
        <p className="mt-2 text-sm text-muted">Password changes and active sessions will be managed here after secure sign-in is connected.</p>
      </section>
    </div>
  );
}
