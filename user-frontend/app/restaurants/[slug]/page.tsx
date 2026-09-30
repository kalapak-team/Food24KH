import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RestaurantView } from "@/components/menu/restaurant-view";
import { getRestaurant, restaurants } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ item?: string | string[] }>;
};

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({ slug: restaurant.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = getRestaurant(slug);
  if (!restaurant) return { title: "Not found" };
  const title = `${restaurant.name} — order online`;
  const description = `${restaurant.description} Rated ${restaurant.rating}/5 · delivery in about ${restaurant.deliveryMinutes} min in ${restaurant.city}.`;
  return {
    title,
    description,
    alternates: { canonical: `/restaurants/${restaurant.slug}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function RestaurantPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { item } = await searchParams;
  const restaurant = getRestaurant(slug);
  if (!restaurant) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": restaurant.kind === "shop" ? "Store" : "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    address: { "@type": "PostalAddress", streetAddress: restaurant.address, addressLocality: restaurant.city, addressCountry: "KH" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: restaurant.rating, reviewCount: restaurant.reviewCount },
    openingHours: restaurant.openingHours,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RestaurantView restaurant={restaurant} initialItemId={typeof item === "string" ? item : undefined} />
    </>
  );
}
