"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFoods, type FoodCard } from "@/lib/catalog-api";
import { resolveFoodImage } from "@/lib/food-images";
import { useMoney } from "@/lib/money";

export function ProductsCatalog() {
  const money = useMoney();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<FoodCard[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFoods({ page, perPage: 30, q: query || undefined })
      .then((response) => {
        if (cancelled) return;
        setFoods(response.data);
        setTotal(response.meta?.total ?? response.data.length);
        setTotalPages(response.meta?.total_pages ?? 1);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Could not load products from the API");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, query]);

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(q.trim());
        }}
      >
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search dishes…"
          className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none focus:border-primary"
        />
        <button type="submit" className="h-12 rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-dark">
          Search
        </button>
      </form>

      <p className="text-sm text-muted" aria-live="polite">
        {loading ? "Loading…" : `${total.toLocaleString()} products from PostgreSQL`}
      </p>

      {error && (
        <p className="rounded-2xl border border-error/30 bg-red-50 p-4 text-sm text-error">
          {error}. Start the Rails API on port 3000, then refresh.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {foods.map((food) => {
          return (
            <Link key={food.id} href={`/foods/${food.id}`} className="group rounded-2xl border border-border bg-card p-2 hover:border-primary hover:shadow-md">
                  <div className="aspect-square overflow-hidden rounded-xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveFoodImage(food)} alt={food.name} className="h-full w-full object-contain p-1" />
                  </div>
              <p className="mt-2 line-clamp-2 text-sm font-semibold group-hover:text-primary">{food.name}</p>
              <p className="line-clamp-1 text-xs text-muted">{food.restaurantName}</p>
              <p className="mt-1 text-sm font-bold">{money(food.discountPrice ?? food.price)}</p>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="h-10 rounded-full border border-border px-4 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-muted">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="h-10 rounded-full border border-border px-4 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
