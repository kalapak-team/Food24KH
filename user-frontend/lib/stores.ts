"use client";

import { createPersistentStore } from "@/lib/store";
import type { Address, Cart, Currency, Locale, Order, Profile } from "@/types";

export const preferencesStore = createPersistentStore<{ locale: Locale; currency: Currency }>(
  "food24kh:preferences",
  { locale: "en", currency: "USD" }
);

export const cartStore = createPersistentStore<Cart>("food24kh:cart", {
  restaurantSlug: null,
  lines: [],
});

export const favoritesStore = createPersistentStore<{ restaurants: string[]; foods: string[] }>(
  "food24kh:favorites",
  { restaurants: [], foods: [] }
);

export const addressesStore = createPersistentStore<Address[]>("food24kh:addresses", []);

export const ordersStore = createPersistentStore<Order[]>("food24kh:orders", []);

export const recentlyViewedStore = createPersistentStore<string[]>("food24kh:recent", []);

export const profileStore = createPersistentStore<Profile>("food24kh:profile", {
  name: "",
  phone: "",
  email: "",
});

export function toggleFavorite(type: "restaurants" | "foods", id: string) {
  favoritesStore.set((previous) => {
    const list = previous[type];
    return {
      ...previous,
      [type]: list.includes(id) ? list.filter((item) => item !== id) : [id, ...list],
    };
  });
}

export function markRecentlyViewed(slug: string) {
  recentlyViewedStore.set((previous) =>
    [slug, ...previous.filter((item) => item !== slug)].slice(0, 8)
  );
}
