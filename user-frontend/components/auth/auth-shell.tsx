import type { ReactNode } from "react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div className="hidden overflow-hidden rounded-3xl bg-primary p-10 text-white lg:block">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Food24KH</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight">Cambodia&apos;s favourite food, any time of day.</h2>
        <ul className="mt-6 space-y-3 text-white/85">
          <li>🍲 Hundreds of local dishes</li>
          <li>🛒 Groceries and essentials</li>
          <li>💵 Pay in USD or KHR</li>
        </ul>
        <div className="mt-10 flex gap-3 text-6xl" aria-hidden>
          <span>🍜</span>
          <span>🧋</span>
          <span>🥐</span>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
