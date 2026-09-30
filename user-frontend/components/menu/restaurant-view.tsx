"use client";

import { Bike, ChevronLeft, Clock, Heart, Info, MapPin, Search, ShoppingBag, Star, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartPanel } from "@/components/cart/cart-panel";
import { ItemModal } from "@/components/menu/item-modal";
import { FoodCard } from "@/components/restaurant/food-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { VisualTile } from "@/components/ui/visual-tile";
import { fetchRestaurant } from "@/lib/catalog-api";
import { getCategory, getMenu, getMenuCategories } from "@/lib/data";
import { resolveRestaurantCover } from "@/lib/food-images";
import { useLocale, useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { cartSubtotal } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { cartStore, favoritesStore, markRecentlyViewed, toggleFavorite } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { FoodItem, Restaurant } from "@/types";

export function RestaurantView({ restaurant, initialItemId }: { restaurant: Restaurant; initialItemId?: string }) {
  const t = useT();
  const locale = useLocale();
  const money = useMoney();
  const cart = useStore(cartStore);
  const favorites = useStore(favoritesStore);
  const fallbackMenu = useMemo(() => getMenu(restaurant.slug), [restaurant.slug]);
  const [menu, setMenu] = useState<FoodItem[]>(fallbackMenu);
  const [coverImage, setCoverImage] = useState<string | undefined>(
    () => resolveRestaurantCover(restaurant, fallbackMenu) ?? undefined
  );
  const categories = useMemo(() => {
    const fromMenu = Array.from(new Set(menu.map((item) => item.category)));
    return fromMenu.length ? fromMenu : getMenuCategories(restaurant.slug);
  }, [menu, restaurant.slug]);
  const [selected, setSelected] = useState<FoodItem | null>(
    () => fallbackMenu.find((item) => item.id === initialItemId) ?? null
  );
  const [infoOpen, setInfoOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "");
  const [headerOffset, setHeaderOffset] = useState(96);

  useEffect(() => {
    markRecentlyViewed(restaurant.slug);
  }, [restaurant.slug]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const sync = () => setHeaderOffset(Math.ceil(header.getBoundingClientRect().height));
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(header);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchRestaurant(restaurant.slug)
      .then((response) => {
        if (cancelled) return;
        setMenu(response.data.foods);
        setCoverImage((prev) => resolveRestaurantCover(response.data, response.data.foods) ?? prev);
        if (initialItemId) {
          const found = response.data.foods.find((item) => item.id === initialItemId);
          if (found) setSelected(found);
        }
      })
      .catch(() => {
        /* keep local fallback menu + cover */
      });
    return () => {
      cancelled = true;
    };
  }, [restaurant.slug, initialItemId]);

  useEffect(() => {
    if (categories[0] && !categories.includes(activeCategory)) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(sectionId(category)))
      .filter((element): element is HTMLElement => Boolean(element));
    const stickyReserve = headerOffset + 80;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveCategory(visible.target.getAttribute("data-category") ?? "");
      },
      { rootMargin: `-${stickyReserve}px 0px -55% 0px` }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories, query, headerOffset]);

  const needle = query.trim().toLowerCase();
  const filteredMenu = needle
    ? menu.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(needle))
    : menu;
  const popular = menu.filter((item) => item.popular);
  const isFavorite = favorites.restaurants.includes(restaurant.slug);
  const cartIsHere = cart.restaurantSlug === restaurant.slug && cart.lines.length > 0;
  const cartCount = cartIsHere ? cart.lines.reduce((sum, line) => sum + line.quantity, 0) : 0;
  const tags = restaurant.tags
    .map((tag) => getCategory(tag))
    .filter(Boolean)
    .map((category) => (locale === "km" ? category!.nameKm : category!.name));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:pb-10">
      <nav aria-label="Breadcrumb" className="py-4 text-sm">
        <Link href={restaurant.kind === "shop" ? "/shops" : "/"} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {restaurant.kind === "shop" ? t("shops") : t("allRestaurants")}
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-3xl">
            <VisualTile
              emoji={restaurant.emoji}
              tint={restaurant.tint}
              imageUrl={coverImage}
              className="h-48 bg-white sm:h-64"
              emojiClassName="text-8xl"
              label={`${restaurant.name} cover`}
            />
            <button
              type="button"
              onClick={() => toggleFavorite("restaurants", restaurant.slug)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remove from favourites" : "Save to favourites"}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white shadow"
            >
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-primary text-primary" : "")} aria-hidden />
            </button>
          </div>

          <header className="mt-5">
            <p className="text-sm text-muted">{"$".repeat(restaurant.priceLevel)} · {tags.join(" · ")}</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{restaurant.name}</h1>
            <p className="mt-2 max-w-2xl text-muted">{restaurant.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 font-semibold ring-1 ring-border">
                <Star className="h-4 w-4 fill-secondary text-secondary" aria-hidden />
                {restaurant.rating.toFixed(1)} <span className="font-normal text-muted">({restaurant.reviewCount.toLocaleString()} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 ring-1 ring-border">
                <Clock className="h-4 w-4 text-primary" aria-hidden /> {restaurant.deliveryMinutes} {t("min")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 ring-1 ring-border">
                <Bike className="h-4 w-4 text-primary" aria-hidden /> {money(restaurant.deliveryFee)}
              </span>
              <span className={cn("rounded-full px-3 py-1.5 font-semibold", restaurant.isOpen ? "bg-green-50 text-success" : "bg-red-50 text-error")}>
                {restaurant.isOpen ? t("openNow") : t("closed")}
              </span>
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 font-semibold text-primary hover:bg-primary-soft"
              >
                <Info className="h-4 w-4" aria-hidden /> {t("info")}
              </button>
            </div>
            {(restaurant.promotion || restaurant.freeDeliveryFirstOrder) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {restaurant.promotion && (
                  <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3">
                    <Tag className="h-5 w-5 text-primary" aria-hidden />
                    <p className="text-sm font-semibold text-primary">{restaurant.promotion}</p>
                  </div>
                )}
                {restaurant.freeDeliveryFirstOrder && (
                  <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-soft px-4 py-3">
                    <Bike className="h-5 w-5 text-primary" aria-hidden />
                    <p className="text-sm font-semibold text-primary">{t("freeFirstOrder")}</p>
                  </div>
                )}
              </div>
            )}
            {!restaurant.isOpen && (
              <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-error">
                This {restaurant.kind} is closed right now ({restaurant.openingHours}). You can browse the menu, but ordering is paused.
              </p>
            )}
          </header>

          <div
            className="sticky z-20 mt-6 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm"
            style={{ top: headerOffset + 8 }}
          >
            <div className="flex items-center gap-3">
              <label className="relative w-44 shrink-0 sm:w-56">
                <span className="sr-only">{t("menuSearch")}</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("menuSearch")}
                  className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </label>
              {!needle && (
                <nav aria-label="Menu categories" className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto">
                  {categories.map((category) => (
                    <a
                      key={category}
                      href={`#${sectionId(category)}`}
                      aria-current={activeCategory === category ? "true" : undefined}
                      className={cn(
                        "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition",
                        activeCategory === category ? "bg-primary text-white" : "text-foreground hover:bg-primary-soft"
                      )}
                    >
                      {category}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {!needle && popular.length > 0 && (
            <section className="mt-8" aria-labelledby="popular-items">
              <h2 id="popular-items" className="font-display text-xl font-bold">
                🔥 {t("popular")}
              </h2>
              <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
                {popular.map((item) => (
                  <FoodCard key={item.id} food={item} layout="tile" onSelect={setSelected} disabled={!restaurant.isOpen} />
                ))}
              </div>
            </section>
          )}

          {needle && filteredMenu.length === 0 && (
            <div className="mt-8">
              <EmptyState emoji="🔎" title="No items found" text={`Nothing on this menu matches “${query}”.`} />
            </div>
          )}

          {categories.map((category) => {
            const items = filteredMenu.filter((item) => item.category === category);
            if (!items.length) return null;
            return (
              <section
                key={category}
                id={sectionId(category)}
                data-category={category}
                className="mt-10"
                style={{ scrollMarginTop: headerOffset + 88 }}
              >
                <h2 className="font-display text-xl font-bold">{category}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <FoodCard key={item.id} food={item} onSelect={setSelected} disabled={!restaurant.isOpen} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="hidden lg:block" aria-label={t("yourCart")}>
          <div
            className="sticky rounded-3xl border border-border bg-card p-5 shadow-sm"
            style={{ top: headerOffset + 16 }}
          >
            <h2 className="mb-2 font-display text-lg font-bold">{t("yourCart")}</h2>
            <CartPanel compact />
          </div>
        </aside>
      </div>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 lg:hidden">
          <Link
            href="/cart"
            className="flex h-14 items-center justify-between rounded-full bg-primary px-5 font-semibold text-white"
          >
            <span className="flex items-center gap-2">
              <span className="relative">
                <ShoppingBag className="h-5 w-5" aria-hidden />
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-slate-950">
                  {cartCount}
                </span>
              </span>
              <span className="ml-2">{t("viewCart")}</span>
            </span>
            <span>{money(cartSubtotal(cart.lines))}</span>
          </Link>
        </div>
      )}

      <ItemModal food={selected} onClose={() => setSelected(null)} />

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title={t("info")}>
        <div className="space-y-5 p-5 text-sm">
          <div>
            <h3 className="font-bold">{restaurant.name}</h3>
            <p className="mt-1 text-muted">{restaurant.description}</p>
          </div>
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
            <span>
              {restaurant.address}, {restaurant.city}
            </span>
          </p>
          <p className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
            <span>{restaurant.openingHours}</span>
          </p>
          <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-background p-4">
            <div>
              <dt className="text-muted">{t("deliveryFee")}</dt>
              <dd className="font-semibold">{money(restaurant.deliveryFee)}</dd>
            </div>
            <div>
              <dt className="text-muted">{t("minimumOrder")}</dt>
              <dd className="font-semibold">{money(restaurant.minimumOrder)}</dd>
            </div>
            <div>
              <dt className="text-muted">Estimated time</dt>
              <dd className="font-semibold">
                {restaurant.deliveryMinutes} {t("min")}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Pick-up discount</dt>
              <dd className="font-semibold">{restaurant.pickupDiscountPercent ? `${restaurant.pickupDiscountPercent}%` : "—"}</dd>
            </div>
          </dl>
        </div>
      </Modal>
    </div>
  );
}

function sectionId(category: string) {
  return `menu-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
