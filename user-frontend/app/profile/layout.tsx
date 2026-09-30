import type { Metadata } from "next";
import { AccountNav } from "@/components/account/account-nav";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-bold">My account</h1>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
