"use client";

import { useRouter } from "next/navigation";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { FoodCard } from "@/components/restaurant/food-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getRestaurant, searchCatalog } from "@/lib/data";

export function SearchResults({ query }: { query: string }) {
  const router = useRouter();
  const { restaurants, foods } = searchCatalog(query);

  if (!query.trim()) {
    return <EmptyState emoji="🔎" title="Search Food24KH" text="Type a restaurant, cuisine or dish in the search bar above." />;
  }

  if (!restaurants.length && !foods.length) {
    return (
      <EmptyState
        emoji="🍽️"
        title={`No results for “${query}”`}
        text="Try a different spelling, or browse by cuisine instead."
        actionLabel="Browse restaurants"
        actionHref="/restaurants"
      />
    );
  }

  return (
    <div className="space-y-12">
      {restaurants.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold">Restaurants & shops ({restaurants.length})</h2>
          <div className="mt-4 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.slug} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}
      {foods.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold">Dishes & products ({foods.length})</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {foods.slice(0, 30).map((food) => (
              <div key={food.id}>
                <p className="mb-1 text-xs font-semibold text-muted">{getRestaurant(food.restaurantSlug)?.name}</p>
                <FoodCard food={food} onSelect={() => router.push(`/foods/${food.id}`)} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
