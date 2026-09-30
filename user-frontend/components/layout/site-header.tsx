"use client";

import {
  Bike,
  ChevronDown,
  Footprints,
  Heart,
  MapPin,
  Menu,
  Receipt,
  Search,
  ShoppingBag,
  Store,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/brand/logo";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { addressesStore, cartStore, preferencesStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { Currency, Locale } from "@/types";

const modes = [
  { href: "/", key: "delivery", icon: Bike },
  { href: "/pickup", key: "pickup", icon: Footprints },
  { href: "/shops", key: "shops", icon: Store },
  { href: "/products", key: "products", icon: Search },
] as const;

function PartnerBar() {
  const t = useT();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="relative bg-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 text-center text-sm sm:gap-5">
        <p className="font-medium">{t("partnerBar")}</p>
        <Link
          href="/partner"
          className="hidden rounded-full border border-white/60 px-4 py-1 text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-primary sm:inline-block"
        >
          {t("partnerCta")}
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Dismiss partner banner"
        className="absolute right-2 top-1.5 grid h-7 w-7 place-items-center rounded-full hover:bg-white/15"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function PreferenceSelects({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const preferences = useStore(preferencesStore);
  const selectClass =
    "h-10 cursor-pointer appearance-none rounded-full border border-border bg-card pl-3 pr-8 text-sm font-semibold text-foreground hover:border-primary";
  return (
    <div className={cn("flex items-center gap-2", compact && "w-full")}>
      <label className={cn("relative", compact && "flex-1")}>
        <span className="sr-only">{t("language")}</span>
        <select
          className={cn(selectClass, compact && "w-full")}
          value={preferences.locale}
          onChange={(event) =>
            preferencesStore.set((previous) => ({ ...previous, locale: event.target.value as Locale }))
          }
        >
          <option value="en">EN</option>
          <option value="km">ខ្មែរ</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-primary" aria-hidden />
      </label>
      <label className={cn("relative", compact && "flex-1")}>
        <span className="sr-only">{t("currency")}</span>
        <select
          className={cn(selectClass, compact && "w-full")}
          value={preferences.currency}
          onChange={(event) =>
            preferencesStore.set((previous) => ({ ...previous, currency: event.target.value as Currency }))
          }
        >
          <option value="USD">USD $</option>
          <option value="KHR">KHR ៛</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-primary" aria-hidden />
      </label>
    </div>
  );
}

export function SiteHeader() {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const cart = useStore(cartStore);
  const addresses = useStore(addressesStore);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const itemCount = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
  const onShops = pathname.startsWith("/shops");
  const onProducts = pathname.startsWith("/products");
  const activeMode = onProducts ? "/products" : onShops ? "/shops" : pathname.startsWith("/pickup") ? "/pickup" : "/";
  const showModes = ["/", "/pickup", "/shops", "/products", "/restaurants", "/search"].some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(path) && !pathname.startsWith("/restaurants/"))
  );

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (value) router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  const locationLabel = defaultAddress
    ? `${defaultAddress.label} · ${[defaultAddress.houseNumber, defaultAddress.street, defaultAddress.district]
        .filter(Boolean)
        .join(", ")}`
    : t("chooseLocation");

  const brandRow = (
    <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
      <Logo />

      <Link
        href="/profile/addresses"
        className="ml-2 hidden min-w-0 max-w-sm items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-primary-soft md:flex"
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="truncate font-medium">{locationLabel}</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <nav aria-label="Account" className="hidden items-center gap-1 lg:flex">
          <Link href="/orders" className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-primary-soft">
            <Receipt className="h-4 w-4 text-primary" aria-hidden /> {t("orders")}
          </Link>
          <Link href="/favorites" className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-primary-soft">
            <Heart className="h-4 w-4 text-primary" aria-hidden /> {t("favorites")}
          </Link>
        </nav>
        <Link
          href="/login"
          className="hidden h-10 items-center rounded-full border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft sm:flex"
        >
          {t("login")}
        </Link>
        <Link
          href="/register"
          className="hidden h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark sm:flex"
        >
          {t("signup")}
        </Link>
        <div className="hidden xl:block">
          <PreferenceSelects />
        </div>
        <Link
          href="/cart"
          aria-label={`${t("cart")}, ${itemCount} items`}
          className="relative grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-white"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-slate-950">
              {itemCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full hover:bg-primary-soft xl:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );

  return (
    <header className="z-40 bg-card">
      {/* Scrolls away naturally — no JS height animation (avoids jitter) */}
      <PartnerBar />
      {showModes ? brandRow : (
        <div
          data-site-sticky
          className="sticky top-0 z-40 bg-card shadow-[0_1px_0_var(--border),0_8px_24px_-16px_rgba(0,0,139,0.25)]"
        >
          {brandRow}
        </div>
      )}

      <Link
        href="/profile/addresses"
        className="mx-4 mb-2 flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 text-sm md:hidden"
      >
        <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="truncate font-medium">{locationLabel}</span>
      </Link>

      {showModes && (
        <div
          data-site-sticky
          className="sticky top-0 z-40 bg-card shadow-[0_1px_0_var(--border),0_8px_24px_-16px_rgba(0,0,139,0.25)]"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 md:flex-row md:items-center md:justify-between">
            <nav aria-label="Ordering mode" className="flex gap-1 overflow-x-auto no-scrollbar">
              {modes.map(({ href, key, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={activeMode === href ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2 whitespace-nowrap border-b-[3px] px-4 py-2.5 text-sm font-semibold",
                    activeMode === href
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {t(key)}
                </Link>
              ))}
            </nav>
            <form onSubmit={onSearch} role="search" className="relative w-full md:max-w-md">
              <label htmlFor="site-search" className="sr-only">
                {onShops ? t("searchShopsPlaceholder") : t("searchPlaceholder")}
              </label>
              <Search className="pointer-events-none absolute left-4 top-3 h-5 w-5 text-muted" aria-hidden />
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={onShops ? t("searchShopsPlaceholder") : t("searchPlaceholder")}
                className="h-11 w-full rounded-full border border-transparent bg-background pl-12 pr-4 text-sm outline-none placeholder:text-muted focus:border-primary focus:bg-card"
              />
            </form>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 xl:hidden" onClick={() => setMenuOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="ml-auto flex h-full w-80 max-w-[85vw] flex-col gap-2 bg-card p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-soft"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {[
              { href: "/", label: t("delivery"), icon: Bike },
              { href: "/pickup", label: t("pickup"), icon: Footprints },
              { href: "/shops", label: t("shops"), icon: Store },
              { href: "/orders", label: t("orders"), icon: Receipt },
              { href: "/favorites", label: t("favorites"), icon: Heart },
              { href: "/profile", label: t("profile"), icon: User },
              { href: "/profile/addresses", label: t("addresses"), icon: MapPin },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center gap-3 rounded-xl px-3 font-semibold hover:bg-primary-soft"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                {label}
              </Link>
            ))}
            <div className="my-3 border-t border-border" />
            <PreferenceSelects compact />
            <div className="mt-auto grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="flex h-11 items-center justify-center rounded-full border border-primary font-semibold text-primary">
                {t("login")}
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="flex h-11 items-center justify-center rounded-full bg-primary font-semibold text-white">
                {t("signup")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
