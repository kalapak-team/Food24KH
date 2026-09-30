"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { FoodDetail } from "@/components/menu/food-detail";
import { fetchFood, fetchRestaurant } from "@/lib/catalog-api";
import { getFood, getRestaurant } from "@/lib/data";
import type { FoodItem, Restaurant } from "@/types";

export function FoodDetailLoader({ id }: { id: string }) {
  const localFood = getFood(id);
  const localRestaurant = localFood ? getRestaurant(localFood.restaurantSlug) : undefined;
  const [food, setFood] = useState<FoodItem | null>(localFood ?? null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(localRestaurant ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const foodRes = await fetchFood(id);
        if (cancelled) return;
        setFood(foodRes.data);
        const restaurantRes = await fetchRestaurant(foodRes.data.restaurantSlug);
        if (cancelled) return;
        setRestaurant(restaurantRes.data);
      } catch {
        if (!localFood || !localRestaurant) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, localFood, localRestaurant]);

  if (failed) notFound();
  if (!food || !restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-muted">
        Loading dish photo and details…
      </div>
    );
  }
  return <FoodDetail food={food} restaurant={restaurant} />;
}
