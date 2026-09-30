"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getFood, getRestaurant } from "@/lib/data";
import { resolveFoodImage } from "@/lib/food-images";
import { useMoney } from "@/lib/money";
import { useStore } from "@/lib/store";
import { favoritesStore, toggleFavorite } from "@/lib/stores";

export function FavoritesView() {
  const money = useMoney();
  const favorites = useStore(favoritesStore);
  const restaurants = favorites.restaurants.map(getRestaurant).filter((item) => item !== undefined);
  const foods = favorites.foods.map(getFood).filter((item) => item !== undefined);

  if (!restaurants.length && !foods.length) {
    return (
      <EmptyState
        emoji="💙"
        title="You have no favourites yet"
        text="Tap the heart on any restaurant, shop or dish to save it here."
        actionLabel="Explore restaurants"
        actionHref="/"
      />
    );
  }

  return (
    <div className="space-y-12">
      {restaurants.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold">Restaurants & shops</h2>
          <div className="mt-4 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.slug} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}
      {foods.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold">Dishes</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {foods.map((food) => (
              <li key={food.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <span className="grid h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-border" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveFoodImage(food)}
                    alt=""
                    className="h-full w-full object-contain p-1"
                  />
                </span>
                <Link href={`/foods/${food.id}`} className="min-w-0 flex-1 hover:text-primary">
                  <p className="font-semibold">{food.name}</p>
                  <p className="text-sm text-muted">
                    {getRestaurant(food.restaurantSlug)?.name} · {money(food.discountPrice ?? food.price)}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFavorite("foods", food.id)}
                  aria-label={`Remove ${food.name} from favourites`}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-soft"
                >
                  <Heart className="h-5 w-5 fill-primary text-primary" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
