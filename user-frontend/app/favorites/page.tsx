import type { Metadata } from "next";
import { FavoritesView } from "@/components/account/favorites-view";

export const metadata: Metadata = { title: "Favourites", robots: { index: false } };

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-bold">Favourites</h1>
      <FavoritesView />
    </div>
  );
}
