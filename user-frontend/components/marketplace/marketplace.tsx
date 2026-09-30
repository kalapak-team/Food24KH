"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DealCard } from "@/components/marketplace/deal-card";
import { FilterLayout } from "@/components/marketplace/filter-layout";
import { applyFilters } from "@/components/marketplace/filtering";
import { defaultFilters, type FilterState } from "@/components/marketplace/filters-panel";
import { HomeHero } from "@/components/marketplace/home-hero";
import { Rail } from "@/components/marketplace/rail";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchFoods, fetchRestaurants, type FoodCard } from "@/lib/catalog-api";
import { cuisines, deals } from "@/lib/data";
import { resolveFoodImage } from "@/lib/food-images";
import { useLocale, useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { useStore } from "@/lib/store";
import { recentlyViewedStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types";
import { Compass, Smartphone } from "lucide-react";

type MarketplaceProps = {
  mode: "delivery" | "pickup";
  initialTags?: string[];
  heading?: string;
};

export function Marketplace({ mode, initialTags = [], heading }: MarketplaceProps) {
  const t = useT();
  const locale = useLocale();
  const money = useMoney();
  const recentSlugs = useStore(recentlyViewedStore);
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    sort: mode === "pickup" ? "distance" : "relevance",
    tags: initialTags,
  });
  const [apiRestaurants, setApiRestaurants] = useState<Restaurant[] | null>(null);
  const [apiDishes, setApiDishes] = useState<FoodCard[]>([]);
  const [productPreview, setProductPreview] = useState<FoodCard[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [restaurantsRes, popularRes, productsRes] = await Promise.all([
          fetchRestaurants({ kind: "restaurant", perPage: 60 }),
          fetchFoods({ popular: true, perPage: 16 }),
          fetchFoods({ page: 1, perPage: 24 }),
        ]);
        if (cancelled) return;
        setApiRestaurants(restaurantsRes.data);
        setApiDishes(popularRes.data);
        setProductPreview(productsRes.data);
        setProductsTotal(productsRes.meta?.total ?? productsRes.data.length);
      } catch {
        if (!cancelled) {
          setApiRestaurants([]);
          setApiDishes([]);
          setProductPreview([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const food = useMemo(() => (apiRestaurants ?? []).filter((restaurant) => restaurant.kind === "restaurant"), [apiRestaurants]);
  const results = useMemo(() => applyFilters(food, filters), [food, filters]);
  const popular = useMemo(() => [...food].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8), [food]);
  const nearest = useMemo(() => [...food].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 8), [food]);
  const recent = recentSlugs
    .map((slug) => food.find((restaurant) => restaurant.slug === slug))
    .filter((restaurant): restaurant is Restaurant => Boolean(restaurant));
  const filtersActive = JSON.stringify({ ...filters, sort: "x" }) !== JSON.stringify({ ...defaultFilters, sort: "x", tags: [] });

  const toggleCuisine = (slug: string) =>
    setFilters((previous) => ({
      ...previous,
      tags: previous.tags.includes(slug) ? previous.tags.filter((tag) => tag !== slug) : [...previous.tags, slug],
    }));

  return (
    <>
      {!heading && mode === "delivery" && <HomeHero dishCount={productsTotal} />}

      <FilterLayout
        filters={filters}
        onChange={setFilters}
        categories={cuisines}
        categoryTitle="cuisines"
        resultCount={results.length}
      >
        {heading && <h1 className="mt-2 font-display text-3xl font-bold">{heading}</h1>}

      {!heading && mode === "pickup" && (
        <section className="mt-2 flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Skip the delivery fee — pick it up yourself</h1>
            <p className="mt-1 text-sm text-muted">
              Order ahead and collect when it&apos;s ready. Many partners give extra pick-up discounts.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
            <Compass className="h-4 w-4" aria-hidden /> Sorted by distance
          </span>
        </section>
      )}

      <Rail title={t("favouriteCuisines")}>
        {cuisines.map((cuisine) => {
          const active = filters.tags.includes(cuisine.slug);
          return (
            <button
              key={cuisine.slug}
              type="button"
              onClick={() => toggleCuisine(cuisine.slug)}
              aria-pressed={active}
              className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "relative grid h-20 w-20 place-items-center rounded-2xl bg-white transition",
                  active ? "ring-2 ring-primary" : "ring-1 ring-border group-hover:ring-primary"
                )}
              >
                <span className="absolute inset-0 overflow-hidden rounded-2xl">
                  {cuisine.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cuisine.imageUrl} alt="" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-4xl" aria-hidden>
                      {cuisine.emoji}
                    </span>
                  )}
                </span>
              </span>
              <span className={cn("text-center text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
                {locale === "km" ? cuisine.nameKm : cuisine.name}
              </span>
            </button>
          );
        })}
      </Rail>

      {!filtersActive && (
        <>
          <Rail title={t("dailyDeals")}>
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Rail>

          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">All dishes with real photos</h2>
                <p className="text-sm text-muted">{productsTotal || "…"} products from your PostgreSQL database</p>
              </div>
              <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
                View all →
              </Link>
            </div>
            {productPreview.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted">
                Loading dishes from the API… Make sure Rails is running on port 3000.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {productPreview.map((item) => {
                  const src = resolveFoodImage(item);
                  return (
                    <Link key={item.id} href={`/foods/${item.id}`} className="group rounded-2xl border border-border bg-card p-2 hover:border-primary">
                      <div className="aspect-square overflow-hidden rounded-xl bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={item.name} className="h-full w-full object-contain p-1" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-primary">{item.name}</p>
                      <p className="line-clamp-1 text-xs text-muted">{item.restaurantName}</p>
                      <p className="text-sm font-bold">{money(item.discountPrice ?? item.price)}</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <Rail title={mode === "pickup" ? t("nearYou") : t("popularRestaurants")}>
            {(mode === "pickup" ? nearest : popular).map((restaurant) => (
              <RestaurantCard key={restaurant.slug} restaurant={restaurant} mode={mode} className="w-72 shrink-0 snap-start" />
            ))}
          </Rail>

          {recent.length > 0 && (
            <Rail title={t("recentlyViewed")}>
              {recent.map((restaurant) => (
                <RestaurantCard key={restaurant.slug} restaurant={restaurant} mode={mode} className="w-64 shrink-0 snap-start" />
              ))}
            </Rail>
          )}

          <Rail title={t("popularDishes")}>
            {apiDishes.map((item) => {
              const src = resolveFoodImage(item);
              return (
                <Link key={item.id} href={`/foods/${item.id}`} className="group w-40 shrink-0 snap-start sm:w-44">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-border transition group-hover:ring-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={item.name} className="h-full w-full object-contain p-1" />
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm font-semibold group-hover:text-primary">{item.name}</p>
                  <p className="line-clamp-1 text-xs text-muted">{item.restaurantName}</p>
                  <p className="text-sm font-bold">{money(item.discountPrice ?? item.price)}</p>
                </Link>
              );
            })}
          </Rail>

          <section className="mt-10 flex flex-col items-start gap-5 rounded-3xl bg-primary-soft p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary text-white">
              <Smartphone className="h-10 w-10" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">{t("appTitle")}</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">{t("appText")}</p>
            </div>
          </section>
        </>
      )}

      <section className="mt-10" aria-labelledby="all-restaurants">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="all-restaurants" className="font-display text-2xl font-bold tracking-tight sm:text-[1.7rem]">
            {t("allRestaurants")}
          </h2>
          <p className="text-sm text-muted" aria-live="polite">
            {results.length} {t("restaurantsFound")}
          </p>
        </div>
        {apiRestaurants === null ? (
          <p className="text-sm text-muted">Loading restaurants from PostgreSQL…</p>
        ) : results.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((restaurant) => (
              <RestaurantCard key={restaurant.slug} restaurant={restaurant} mode={mode} />
            ))}
          </div>
        ) : (
          <EmptyState emoji="🍽️" title={t("noResults")}>
            <button
              type="button"
              onClick={() => setFilters({ ...defaultFilters, sort: filters.sort })}
              className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-semibold text-white"
            >
              {t("resetFilters")}
            </button>
          </EmptyState>
        )}
      </section>
    </FilterLayout>
    </>
  );
}
