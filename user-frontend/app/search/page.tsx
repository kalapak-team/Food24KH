import type { Metadata } from "next";
import { SearchResults } from "@/components/search/search-results";

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  return { title: query ? `Search: ${query}` : "Search", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 80) : "";
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold">
        {query ? (
          <>
            Results for <span className="text-primary">“{query}”</span>
          </>
        ) : (
          "Search"
        )}
      </h1>
      <SearchResults query={query} />
    </div>
  );
}
