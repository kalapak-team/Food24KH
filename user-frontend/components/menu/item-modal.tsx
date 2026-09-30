"use client";

import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { FoodPhoto } from "@/components/ui/food-photo";
import { Modal } from "@/components/ui/modal";
import { addLine, buildLine, cartHasOtherRestaurant } from "@/lib/cart";
import { resolveFoodImage } from "@/lib/food-images";
import { useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { useStore } from "@/lib/store";
import { favoritesStore, toggleFavorite } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { CartSelection, FoodItem } from "@/types";

type ItemModalProps = {
  food: FoodItem | null;
  onClose: () => void;
  onAdded?: () => void;
};

export function ItemModal({ food, onClose, onAdded }: ItemModalProps) {
  return (
    <Modal open={Boolean(food)} onClose={onClose} title={food?.name ?? "Item"} hideTitle className="sm:max-w-2xl">
      {food && <ItemForm key={food.id} food={food} onClose={onClose} onAdded={onAdded} />}
    </Modal>
  );
}

function ItemForm({ food, onClose, onAdded }: { food: FoodItem; onClose: () => void; onAdded?: () => void }) {
  const t = useT();
  const money = useMoney();
  const favorites = useStore(favoritesStore);
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(food.optionGroups.map((group) => [group.id, group.choices[0].id]))
  );
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [confirmReplace, setConfirmReplace] = useState(false);

  const selections: CartSelection[] = food.optionGroups.map((group) => {
    const choice = group.choices.find((item) => item.id === choices[group.id]) ?? group.choices[0];
    return { groupId: group.id, groupName: group.name, choiceId: choice.id, choiceName: choice.name, priceDelta: choice.priceDelta };
  });
  const addons = food.addons.filter((addon) => addonIds.includes(addon.id));
  const line = buildLine(food, selections, addons, quantity, note);
  const isFavorite = favorites.foods.includes(food.id);

  function add(replaceCart: boolean) {
    if (!replaceCart && cartHasOtherRestaurant(food.restaurantSlug)) {
      setConfirmReplace(true);
      return;
    }
    addLine(food.restaurantSlug, line, replaceCart);
    onAdded?.();
    onClose();
  }

  if (confirmReplace) {
    return (
      <div className="p-6 pt-16 text-center">
        <span className="text-5xl" aria-hidden>
          🛒
        </span>
        <h2 className="mt-4 font-display text-xl font-bold">{t("newCartTitle")}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{t("newCartText")}</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => setConfirmReplace(false)} className="h-12 rounded-full border border-border font-semibold hover:border-primary">
            {t("keepCart")}
          </button>
          <button type="button" onClick={() => add(true)} className="h-12 rounded-full bg-primary font-semibold text-white hover:bg-primary-dark">
            {t("startNew")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        add(false);
      }}
    >
      <div className="grid gap-6 p-5 pt-6 sm:grid-cols-[240px_1fr] sm:p-6">
        <FoodPhoto
          name={food.name}
          imageUrl={resolveFoodImage(food)}
          emoji={food.emoji}
          className="aspect-square rounded-2xl ring-1 ring-border"
          imgClassName="p-3"
        />
        <div className="sm:pr-10">
          <h2 className="font-display text-2xl font-bold leading-tight">{food.name}</h2>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{money(food.discountPrice ?? food.price)}</span>
            {food.discountPrice && <span className="text-sm text-muted line-through">{money(food.price)}</span>}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{food.description}</p>
          <p className="mt-2 text-xs text-muted">Ready in about {food.prepMinutes} min</p>
          <button
            type="button"
            onClick={() => toggleFavorite("foods", food.id)}
            aria-pressed={isFavorite}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-semibold hover:border-primary"
          >
            <Heart className={cn("h-4 w-4", isFavorite ? "fill-primary text-primary" : "")} aria-hidden />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 pb-5 sm:px-6">
        {food.optionGroups.map((group) => (
          <fieldset key={group.id} className="rounded-2xl border border-border p-4">
            <legend className="flex w-full items-center justify-between px-1 text-sm font-bold">
              {group.name}
              <span className="ml-3 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{t("required")}</span>
            </legend>
            {group.choices.map((choice) => (
              <label key={choice.id} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 border-b border-border/70 last:border-0">
                <span className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name={group.id}
                    checked={choices[group.id] === choice.id}
                    onChange={() => setChoices((previous) => ({ ...previous, [group.id]: choice.id }))}
                    className="h-5 w-5 accent-[var(--primary)]"
                  />
                  {choice.name}
                </span>
                {choice.priceDelta > 0 && <span className="text-sm text-muted">+{money(choice.priceDelta)}</span>}
              </label>
            ))}
          </fieldset>
        ))}

        {food.addons.length > 0 && (
          <fieldset className="rounded-2xl border border-border p-4">
            <legend className="flex w-full items-center justify-between px-1 text-sm font-bold">
              Add-ons
              <span className="ml-3 rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-muted">{t("optional")}</span>
            </legend>
            {food.addons.map((addon) => (
              <label key={addon.id} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 border-b border-border/70 last:border-0">
                <span className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={addonIds.includes(addon.id)}
                    onChange={() =>
                      setAddonIds((previous) =>
                        previous.includes(addon.id) ? previous.filter((id) => id !== addon.id) : [...previous, addon.id]
                      )
                    }
                    className="h-5 w-5 rounded accent-[var(--primary)]"
                  />
                  {addon.name}
                </span>
                <span className="text-sm text-muted">+{money(addon.price)}</span>
              </label>
            ))}
          </fieldset>
        )}

        <label className="block">
          <span className="text-sm font-bold">{t("specialInstructions")}</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, 200))}
            rows={2}
            placeholder="e.g. No onions, sauce on the side"
            className="mt-2 w-full rounded-2xl border border-border p-3 text-sm outline-none focus:border-primary"
          />
          <span className="text-xs text-muted">{note.length}/200</span>
        </label>
      </div>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-card p-4">
        <div className="flex items-center rounded-full border border-border" role="group" aria-label={t("quantity")}>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="grid h-12 w-12 place-items-center rounded-full text-primary disabled:text-muted"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="w-8 text-center font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(50, value + 1))}
            aria-label="Increase quantity"
            className="grid h-12 w-12 place-items-center rounded-full text-primary"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <button type="submit" className="flex h-12 flex-1 items-center justify-between rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-dark">
          <span>{t("addToCart")}</span>
          <span>{money(line.unitPrice * quantity)}</span>
        </button>
      </div>
    </form>
  );
}
