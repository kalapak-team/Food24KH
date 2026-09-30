"use client";

import { ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ItemModal } from "@/components/menu/item-modal";
import { FoodCard } from "@/components/restaurant/food-card";
import { FoodPhoto } from "@/components/ui/food-photo";
import { getMenu } from "@/lib/data";
import { resolveFoodImage } from "@/lib/food-images";
import { useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import type { FoodItem, Restaurant } from "@/types";

export function FoodDetail({ food, restaurant }: { food: FoodItem; restaurant: Restaurant }) {
  const t = useT();
  const money = useMoney();
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const related = getMenu(restaurant.slug).filter((item) => item.id !== food.id).slice(0, 6);
  const imageUrl = resolveFoodImage(food);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Link href={`/restaurants/${restaurant.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        <ChevronLeft className="h-4 w-4" aria-hidden /> {restaurant.name}
      </Link>

      <article className="mt-4 grid gap-8 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
        <FoodPhoto
          name={food.name}
          imageUrl={imageUrl}
          emoji={food.emoji}
          className="aspect-square rounded-2xl ring-1 ring-border"
          imgClassName="p-4"
        />
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-primary">{food.category}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold">{food.name}</h1>
          <p className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{money(food.discountPrice ?? food.price)}</span>
            {food.discountPrice && <span className="text-muted line-through">{money(food.price)}</span>}
          </p>
          <p className="mt-4 leading-7 text-muted">{food.description}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" aria-hidden /> Prepared in about {food.prepMinutes} min
          </p>
          {food.optionGroups.length + food.addons.length > 0 && (
            <p className="mt-2 text-sm text-muted">
              Customisable: {[...food.optionGroups.map((group) => group.name), food.addons.length ? "Add-ons" : ""].filter(Boolean).join(", ")}
            </p>
          )}
          <button
            type="button"
            onClick={() => setSelected({ ...food, imageUrl })}
            disabled={!restaurant.isOpen || !food.available}
            className="mt-8 h-12 rounded-full bg-primary px-8 font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-muted md:self-start"
          >
            {restaurant.isOpen ? t("addToCart") : t("opensLater")}
          </button>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">More from {restaurant.name}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <FoodCard key={item.id} food={item} onSelect={setSelected} disabled={!restaurant.isOpen} />
            ))}
          </div>
        </section>
      )}

      <ItemModal food={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
