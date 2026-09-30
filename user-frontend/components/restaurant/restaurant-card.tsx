"use client";

import { Bike, Clock, Heart, MapPin, Star, Tag } from "lucide-react";
import Link from "next/link";
import { VisualTile } from "@/components/ui/visual-tile";
import { getCategory } from "@/lib/data";
import { resolveRestaurantCover } from "@/lib/food-images";
import { useLocale, useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { useStore } from "@/lib/store";
import { favoritesStore, toggleFavorite } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
  mode?: "delivery" | "pickup";
  className?: string;
};

export function RestaurantCard({ restaurant, mode = "delivery", className }: RestaurantCardProps) {
  const t = useT();
  const locale = useLocale();
  const money = useMoney();
  const favorites = useStore(favoritesStore);
  const isFavorite = favorites.restaurants.includes(restaurant.slug);
  const tags = restaurant.tags
    .map((tag) => getCategory(tag))
    .filter(Boolean)
    .map((category) => (locale === "km" ? category!.nameKm : category!.name))
    .join(" · ");
  const coverImage = resolveRestaurantCover(restaurant) ?? undefined;
  const isLogo = Boolean(restaurant.logoUrl) || restaurant.kind === "shop";

  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/restaurants/${restaurant.slug}`}
        className="block rounded-2xl outline-offset-4"
        aria-label={`${restaurant.name}, rated ${restaurant.rating}`}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <VisualTile
            emoji={restaurant.emoji}
            tint={restaurant.tint}
            imageUrl={coverImage}
            label={restaurant.name}
            className={cn(
              "aspect-[16/10] bg-white transition duration-300 group-hover:scale-[1.03]",
              isLogo && "ring-1 ring-border"
            )}
            emojiClassName="text-6xl"
            fit={isLogo ? "logo" : "photo"}
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {restaurant.promotion && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary shadow">
                <Tag className="h-3 w-3" aria-hidden /> {restaurant.promotion}
              </span>
            )}
            {mode === "pickup" && restaurant.pickupDiscountPercent && (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-slate-950 shadow">
                {t("pickupSave")} −{restaurant.pickupDiscountPercent}%
              </span>
            )}
          </div>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold shadow">
            <Clock className="h-3 w-3 text-primary" aria-hidden />
            {mode === "pickup" ? `${Math.round(restaurant.deliveryMinutes * 0.6)}` : restaurant.deliveryMinutes} {t("min")}
          </span>
          {!restaurant.isOpen && (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/55">
              <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold">{t("opensLater")}</span>
            </div>
          )}
        </div>

        <div className="mt-3 px-0.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-display font-bold group-hover:text-primary">{restaurant.name}</h3>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-secondary text-secondary" aria-hidden />
              {restaurant.rating.toFixed(1)}
              <span className="font-normal text-muted">({restaurant.reviewCount.toLocaleString()})</span>
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted">
            {"$".repeat(restaurant.priceLevel)} · {tags}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {mode === "pickup" ? (
              <span className="inline-flex items-center gap-1 text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {restaurant.distanceKm.toFixed(1)} km
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-muted">
                <Bike className="h-3.5 w-3.5" aria-hidden /> {money(restaurant.deliveryFee)}
              </span>
            )}
            {mode === "delivery" && restaurant.freeDeliveryFirstOrder && (
              <span className="font-semibold text-primary">{t("freeFirstOrder")}</span>
            )}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite("restaurants", restaurant.slug)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${restaurant.name} from favourites` : `Save ${restaurant.name} to favourites`}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow hover:scale-105"
      >
        <Heart className={cn("h-5 w-5", isFavorite ? "fill-primary text-primary" : "text-slate-700")} aria-hidden />
      </button>
    </article>
  );
}
