"use client";

import Link from "next/link";
import { CartPanel } from "@/components/cart/cart-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { clearCart } from "@/lib/cart";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cartStore } from "@/lib/stores";

export function CartPage() {
  const t = useT();
  const cart = useStore(cartStore);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">{t("yourCart")}</h1>
        {cart.lines.length > 0 && (
          <button type="button" onClick={clearCart} className="text-sm font-semibold text-error hover:underline">
            Clear cart
          </button>
        )}
      </div>
      {cart.lines.length ? (
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <CartPanel />
          <Link href={`/restaurants/${cart.restaurantSlug}`} className="mt-3 block text-center text-sm font-semibold text-primary hover:underline">
            + Add more items
          </Link>
        </div>
      ) : (
        <EmptyState emoji="🛍️" title={t("emptyCart")} text={t("emptyCartText")} actionLabel={t("browse")} actionHref="/" />
      )}
    </div>
  );
}
