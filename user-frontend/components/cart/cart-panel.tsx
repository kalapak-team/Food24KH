"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { FoodPhoto } from "@/components/ui/food-photo";
import { changeQuantity, removeLine } from "@/lib/cart";
import { getRestaurant } from "@/lib/data";
import { resolveFoodImage } from "@/lib/food-images";
import { useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { calculateSummary, lineTotal } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { cartStore } from "@/lib/stores";
import type { CartLine, PriceSummary } from "@/types";

export function CartLineRow({ line }: { line: CartLine }) {
  const money = useMoney();
  const details = [
    ...line.selections.map((selection) => selection.choiceName),
    ...line.addons.map((addon) => `+ ${addon.name}`),
  ].join(", ");

  return (
    <li className="flex gap-3 py-4">
      <FoodPhoto
        name={line.name}
        imageUrl={line.imageUrl ?? resolveFoodImage({ name: line.name, imageUrl: line.imageUrl })}
        emoji={line.emoji}
        className="h-14 w-14 shrink-0 rounded-xl ring-1 ring-border"
        imgClassName="p-1"
      />
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <p className="font-semibold leading-snug">{line.name}</p>
          <p className="shrink-0 text-sm font-semibold">{money(lineTotal(line))}</p>
        </div>
        {details && <p className="mt-0.5 text-xs text-muted">{details}</p>}
        {line.note && <p className="mt-0.5 text-xs italic text-muted">“{line.note}”</p>}
        <div className="mt-2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => (line.quantity === 1 ? removeLine(line.key) : changeQuantity(line.key, -1))}
            aria-label={line.quantity === 1 ? `Remove ${line.name}` : `Decrease ${line.name}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary hover:border-primary"
          >
            {line.quantity === 1 ? <Trash2 className="h-4 w-4" aria-hidden /> : <Minus className="h-4 w-4" aria-hidden />}
          </button>
          <span className="w-8 text-center text-sm font-bold">{line.quantity}</span>
          <button
            type="button"
            onClick={() => changeQuantity(line.key, 1)}
            aria-label={`Increase ${line.name}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary hover:border-primary"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}

export function SummaryRows({ summary }: { summary: PriceSummary }) {
  const t = useT();
  const money = useMoney();
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">{t("subtotal")}</dt>
        <dd>{money(summary.subtotal)}</dd>
      </div>
      {summary.discount > 0 && (
        <div className="flex justify-between text-success">
          <dt>{t("discount")}</dt>
          <dd>−{money(summary.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted">{t("deliveryFee")}</dt>
        <dd>{summary.deliveryFee === 0 ? "Free" : money(summary.deliveryFee)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">{t("serviceFee")}</dt>
        <dd>{money(summary.serviceFee)}</dd>
      </div>
      <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
        <dt>{t("total")}</dt>
        <dd>{money(summary.total)}</dd>
      </div>
    </dl>
  );
}

export function CartPanel({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const money = useMoney();
  const cart = useStore(cartStore);
  const restaurant = cart.restaurantSlug ? getRestaurant(cart.restaurantSlug) : undefined;
  const summary = calculateSummary(cart.lines, restaurant, "delivery");
  const belowMinimum = restaurant && summary.subtotal < restaurant.minimumOrder;

  if (!cart.lines.length) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <span className="text-5xl" aria-hidden>
          🛍️
        </span>
        <p className="mt-3 font-display font-bold">{t("emptyCart")}</p>
        <p className="mt-1 text-sm text-muted">{t("emptyCartText")}</p>
      </div>
    );
  }

  return (
    <div>
      {restaurant && (
        <p className="text-sm text-muted">
          From{" "}
          <Link href={`/restaurants/${restaurant.slug}`} className="font-semibold text-primary hover:underline">
            {restaurant.name}
          </Link>
        </p>
      )}
      <ul className={compact ? "max-h-[45vh] divide-y divide-border overflow-y-auto" : "divide-y divide-border"}>
        {cart.lines.map((line) => (
          <CartLineRow key={line.key} line={line} />
        ))}
      </ul>
      <div className="mt-2 border-t border-border pt-4">
        <SummaryRows summary={summary} />
      </div>
      {belowMinimum && (
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-warning">
          {t("minimumOrder")}: {money(restaurant.minimumOrder)}. Add {money(restaurant.minimumOrder - summary.subtotal)} more to check out.
        </p>
      )}
      <Link
        href="/checkout"
        aria-disabled={belowMinimum}
        onClick={(event) => belowMinimum && event.preventDefault()}
        className={`mt-4 flex h-12 w-full items-center justify-center rounded-full font-semibold ${
          belowMinimum ? "cursor-not-allowed bg-border text-muted" : "bg-primary text-white hover:bg-primary-dark"
        }`}
      >
        {t("checkout")}
      </Link>
    </div>
  );
}
