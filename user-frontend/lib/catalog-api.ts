import { apiGet } from "@/lib/api";
import { resolveFoodImage } from "@/lib/food-images";
import type { FoodItem, Restaurant } from "@/types";

export type FoodCard = FoodItem & { restaurantName?: string };

export type CatalogMeta = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export async function fetchFoods(params: {
  page?: number;
  perPage?: number;
  popular?: boolean;
  restaurantSlug?: string;
  q?: string;
} = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.perPage) query.set("per_page", String(params.perPage));
  if (params.popular) query.set("popular", "true");
  if (params.restaurantSlug) query.set("restaurant_slug", params.restaurantSlug);
  if (params.q) query.set("q", params.q);
  const suffix = query.toString() ? `?${query}` : "";
  return apiGet<FoodCard[]>(`/foods${suffix}`);
}

export async function fetchFood(id: string) {
  return apiGet<FoodItem>(`/foods/${encodeURIComponent(id)}`);
}

export async function fetchRestaurants(params: { page?: number; perPage?: number; kind?: "restaurant" | "shop" } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.perPage) query.set("per_page", String(params.perPage));
  if (params.kind) query.set("kind", params.kind);
  const suffix = query.toString() ? `?${query}` : "";
  return apiGet<(Restaurant & { foodsCount?: number })[]>(`/restaurants${suffix}`);
}

export async function fetchRestaurant(slug: string) {
  return apiGet<Restaurant & { foods: FoodItem[]; menuCategories: string[]; foodsCount?: number }>(
    `/restaurants/${encodeURIComponent(slug)}`
  );
}

export function foodImageSrc(
  imageUrl?: string | null,
  fallback?: { name?: string; category?: string; description?: string; imageUrl?: string | null }
) {
  const resolved = imageUrl || (fallback ? resolveFoodImage(fallback) : null);
  if (!resolved) return null;
  return resolved;
}
