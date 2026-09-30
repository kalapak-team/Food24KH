"use client";

import { BellRing, Clock, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DealCard } from "@/components/marketplace/deal-card";
import { FilterLayout } from "@/components/marketplace/filter-layout";
import { applyFilters } from "@/components/marketplace/filtering";
import { defaultFilters, type FilterState } from "@/components/marketplace/filters-panel";
import { Rail } from "@/components/marketplace/rail";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { EmptyState } from "@/components/ui/empty-state";
import { restaurants, shopDeals, shopTypes } from "@/lib/data";
import { useT } from "@/lib/i18n";

export function ShopsView() {
  const t = useT();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [bannerOpen, setBannerOpen] = useState(true);
  const shops = useMemo(() => restaurants.filter((restaurant) => restaurant.kind === "shop"), []);
  const results = useMemo(() => applyFilters(shops, filters), [shops, filters]);
  const popular = useMemo(() => [...shops].sort((a, b) => b.reviewCount - a.reviewCount), [shops]);

  return (
    <FilterLayout
      filters={filters}
      onChange={setFilters}
      categories={shopTypes}
      categoryTitle="shopTypes"
      resultCount={results.length}
    >
      <h1 className="sr-only">{t("shops")}</h1>
      {bannerOpen && (
        <section className="relative mt-2 overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-r from-primary-soft to-white p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setBannerOpen(false)}
            aria-label="Dismiss banner"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold">
              Groceries & essentials in <span className="text-primary">under an hour</span>
            </h2>
            <p className="mt-2 text-sm text-muted">
              Supermarkets, fresh markets, bakeries, flowers and pet supplies — all from local Cambodian shops.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 ring-1 ring-border">
                <Clock className="h-3.5 w-3.5 text-primary" aria-hidden /> Fast delivery
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 ring-1 ring-border">
                <BellRing className="h-3.5 w-3.5 text-primary" aria-hidden /> Fresh daily stock
              </span>
            </div>
          </div>
          <div className="absolute bottom-3 right-6 hidden h-28 w-28 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-border sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/shops/shop-mart.png" alt="" className="h-full w-full object-contain p-2" />
          </div>
        </section>
      )}

      <Rail title={t("popularShops")}>
        {popular.map((shop) => (
          <Link
            key={shop.slug}
            href={`/restaurants/${shop.slug}`}
            className="group flex w-64 shrink-0 snap-start items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary"
          >
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shop.logoUrl ?? shop.imageUrl ?? "/logos/shops/daily-mart-express.png"} alt="" className="h-full w-full object-contain p-2" />
            </span>
            <div className="min-w-0">
              <p className="line-clamp-1 font-semibold group-hover:text-primary">{shop.name}</p>
              <p className="text-sm text-muted">
                {shop.deliveryMinutes} {t("min")}
              </p>
            </div>
          </Link>
        ))}
      </Rail>

      {results.length === shops.length && (
        <Rail title={t("shopDeals")}>
          {shopDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </Rail>
      )}

      <section className="mt-10" aria-labelledby="all-shops">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="all-shops" className="font-display text-2xl font-bold tracking-tight sm:text-[1.7rem]">
            {t("allShops")}
          </h2>
          <p className="text-sm text-muted" aria-live="polite">
            {results.length} {t("shopsFound")}
          </p>
        </div>
        {results.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((shop) => (
              <RestaurantCard key={shop.slug} restaurant={shop} />
            ))}
          </div>
        ) : (
          <EmptyState emoji="🛒" title={t("noShops")}>
            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-semibold text-white"
            >
              {t("resetFilters")}
            </button>
          </EmptyState>
        )}
      </section>
    </FilterLayout>
  );
}
