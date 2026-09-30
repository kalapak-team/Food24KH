"use client";

import { Plus } from "lucide-react";
import { FoodPhoto } from "@/components/ui/food-photo";
import { resolveFoodImage } from "@/lib/food-images";
import { useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { FoodItem } from "@/types";

type FoodCardProps = {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
  restaurantName?: string;
  layout?: "row" | "tile";
  disabled?: boolean;
};

export function FoodCard({ food, onSelect, restaurantName, layout = "row", disabled = false }: FoodCardProps) {
  const t = useT();
  const money = useMoney();
  const unavailable = disabled || !food.available;
  const imageUrl = resolveFoodImage(food);

  const price = (
    <p className="flex items-baseline gap-2 text-sm">
      <span className="font-bold text-foreground">{money(food.discountPrice ?? food.price)}</span>
      {food.discountPrice && <span className="text-muted line-through">{money(food.price)}</span>}
    </p>
  );

  if (layout === "tile") {
    return (
      <button
        type="button"
        onClick={() => onSelect({ ...food, imageUrl })}
        disabled={unavailable}
        className="group w-40 shrink-0 text-left disabled:opacity-60 sm:w-44"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-border">
          <FoodPhoto name={food.name} imageUrl={imageUrl} emoji={food.emoji} className="h-full w-full" />
          <span className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white text-primary shadow group-hover:bg-primary group-hover:text-white">
            <Plus className="h-5 w-5" aria-hidden />
          </span>
        </div>
        <p className="mt-2 line-clamp-1 text-sm font-semibold">{food.name}</p>
        {restaurantName && <p className="line-clamp-1 text-xs text-muted">{restaurantName}</p>}
        {price}
      </button>
    );
  }

  return (
    <button
      type="button"
      id={`item-${food.id}`}
      onClick={() => onSelect({ ...food, imageUrl })}
      disabled={unavailable}
      className={cn(
        "group flex w-full scroll-mt-40 items-stretch gap-4 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      )}
    >
      <div className="min-w-0 flex-1">
        {food.popular && (
          <span className="mb-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary">
            {t("popular")}
          </span>
        )}
        <h3 className="line-clamp-2 font-semibold">{food.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{food.description}</p>
        <div className="mt-3">{price}</div>
      </div>
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-border">
        <FoodPhoto name={food.name} imageUrl={imageUrl} emoji={food.emoji} className="h-full w-full" />
        <span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-white text-primary shadow-md ring-1 ring-border group-hover:bg-primary group-hover:text-white">
          <Plus className="h-5 w-5" aria-hidden />
          <span className="sr-only">
            {t("add")} {food.name}
          </span>
        </span>
      </div>
    </button>
  );
}
