"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import { FiltersPanel, type FilterState } from "@/components/marketplace/filters-panel";
import { Modal } from "@/components/ui/modal";
import { useT, type TranslationKey } from "@/lib/i18n";
import type { Category } from "@/types";

type FilterLayoutProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: Category[];
  categoryTitle: TranslationKey;
  showSort?: boolean;
  resultCount: number;
  children: ReactNode;
};

export function FilterLayout({ filters, onChange, categories, categoryTitle, showSort, resultCount, children }: FilterLayoutProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const activeCount =
    [filters.topRatedOnly, filters.freeDelivery, filters.openNow, filters.acceptsVouchers, filters.hasDeals].filter(Boolean)
      .length +
    filters.priceLevels.length +
    filters.tags.length;

  const panel = (
    <FiltersPanel value={filters} onChange={onChange} categories={categories} categoryTitle={categoryTitle} showSort={showSort} />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto rounded-2xl border border-border bg-card p-5">
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mb-2 inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
          {t("filters")}
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs text-white">{activeCount}</span>
          )}
        </button>
        {children}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t("filters")}>
        <div className="p-5">{panel}</div>
        <div className="sticky bottom-0 border-t border-border bg-card p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-12 w-full rounded-full bg-primary font-semibold text-white hover:bg-primary-dark"
          >
            {t("applyFilters")} ({resultCount})
          </button>
        </div>
      </Modal>
    </div>
  );
}
