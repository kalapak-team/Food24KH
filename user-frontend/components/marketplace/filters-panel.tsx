"use client";

import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useLocale, useT, type TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export type SortKey = "relevance" | "fastest" | "distance" | "topRated";

export type FilterState = {
  sort: SortKey;
  topRatedOnly: boolean;
  freeDelivery: boolean;
  openNow: boolean;
  acceptsVouchers: boolean;
  hasDeals: boolean;
  priceLevels: number[];
  tags: string[];
};

export const defaultFilters: FilterState = {
  sort: "relevance",
  topRatedOnly: false,
  freeDelivery: false,
  openNow: false,
  acceptsVouchers: false,
  hasDeals: false,
  priceLevels: [],
  tags: [],
};

type FiltersPanelProps = {
  value: FilterState;
  onChange: (value: FilterState) => void;
  categories: Category[];
  categoryTitle: TranslationKey;
  showSort?: boolean;
};

function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 cursor-pointer rounded accent-[var(--primary)]"
      />
      {label}
    </label>
  );
}

export function FiltersPanel({ value, onChange, categories, categoryTitle, showSort = true }: FiltersPanelProps) {
  const t = useT();
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });
  const toggleIn = (list: number[] | string[], item: number | string) =>
    (list as (number | string)[]).includes(item)
      ? (list as (number | string)[]).filter((entry) => entry !== item)
      : [...list, item];

  const visibleCategories = categories.filter((category) =>
    `${category.name} ${category.nameKm}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  const shownCategories = expanded || search ? visibleCategories : visibleCategories.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">{t("filters")}</h2>
        <button
          type="button"
          onClick={() => onChange({ ...defaultFilters, sort: value.sort })}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("clearAll")}
        </button>
      </div>

      {showSort && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold">{t("sortBy")}</legend>
          {(["relevance", "fastest", "distance", "topRated"] as SortKey[]).map((key) => (
            <label key={key} className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="sort"
                checked={value.sort === key}
                onChange={() => set({ sort: key })}
                className="h-5 w-5 cursor-pointer accent-[var(--primary)]"
              />
              {t(key)}
            </label>
          ))}
        </fieldset>
      )}

      <div>
        <p className="mb-2 text-sm font-bold">{t("quickFilters")}</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["topRatedOnly", "ratings4"],
              ["freeDelivery", "freeDelivery"],
              ["openNow", "openNow"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={value[key]}
              onClick={() => set({ [key]: !value[key] })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-semibold",
                value[key] ? "border-primary bg-primary text-white" : "border-border bg-card hover:border-primary"
              )}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-bold">{t("offers")}</legend>
        <Check checked={value.acceptsVouchers} onChange={() => set({ acceptsVouchers: !value.acceptsVouchers })} label={t("acceptsVouchers")} />
        <Check checked={value.hasDeals} onChange={() => set({ hasDeals: !value.hasDeals })} label={t("hasDeals")} />
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">{t("price")}</legend>
        <div className="flex gap-2">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={value.priceLevels.includes(level)}
              onClick={() => set({ priceLevels: toggleIn(value.priceLevels, level) as number[] })}
              className={cn(
                "h-9 flex-1 rounded-full border text-sm font-bold",
                value.priceLevels.includes(level) ? "border-primary bg-primary text-white" : "border-border hover:border-primary"
              )}
            >
              {"$".repeat(level)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">{t(categoryTitle)}</legend>
        <label className="relative mb-2 block">
          <span className="sr-only">{t("searchCuisine")}</span>
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchCuisine")}
            className="h-9 w-full rounded-full bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        {shownCategories.map((category) => (
          <Check
            key={category.slug}
            checked={value.tags.includes(category.slug)}
            onChange={() => set({ tags: toggleIn(value.tags, category.slug) as string[] })}
            label={locale === "km" ? category.nameKm : category.name}
          />
        ))}
        {!search && visibleCategories.length > 8 && (
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary"
          >
            {expanded ? t("showLess") : t("showMore")}
            <ChevronDown className={cn("h-4 w-4 transition", expanded && "rotate-180")} aria-hidden />
          </button>
        )}
      </fieldset>
    </div>
  );
}
