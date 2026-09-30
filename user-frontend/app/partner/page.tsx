import type { Metadata } from "next";
import { PartnerForm } from "@/components/partner/partner-form";

export const metadata: Metadata = {
  title: "Become a partner",
  description: "List your restaurant or shop on Food24KH and reach more customers across Cambodia.",
  alternates: { canonical: "/partner" },
};

const benefits = [
  { emoji: "📈", title: "Reach more customers", text: "Appear in search, categories and daily deals." },
  { emoji: "🧾", title: "Simple order management", text: "Accept, prepare and hand over orders from one dashboard." },
  { emoji: "💬", title: "Local support", text: "A Khmer- and English-speaking partner team." },
];

export default function PartnerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-3xl bg-primary p-8 text-white sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Food24KH for business</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-tight">Grow your restaurant or shop with Food24KH</h1>
        <p className="mt-4 max-w-xl text-white/80">
          Join local partners across Phnom Penh, Siem Reap, Battambang and more. New partners go live after a quick review by our team.
        </p>
      </section>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="text-3xl" aria-hidden>
              {benefit.emoji}
            </span>
            <h2 className="mt-3 font-display font-bold">{benefit.title}</h2>
            <p className="mt-1 text-sm text-muted">{benefit.text}</p>
          </div>
        ))}
      </div>
      <section className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">Partner application</h2>
        <p className="mt-1 text-sm text-muted">Status after submission: Pending review → Approved or Rejected.</p>
        <div className="mt-6">
          <PartnerForm />
        </div>
      </section>
    </div>
  );
}
