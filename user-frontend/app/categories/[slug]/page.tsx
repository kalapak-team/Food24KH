import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Marketplace } from "@/components/marketplace/marketplace";
import { cuisines, getCategory } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cuisines.map((cuisine) => ({ slug: cuisine.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Not found" };
  return {
    title: `${category.name} food delivery`,
    description: `Order ${category.name.toLowerCase()} from the best local restaurants in Cambodia.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = cuisines.find((cuisine) => cuisine.slug === slug);
  if (!category) notFound();
  return <Marketplace mode="delivery" initialTags={[slug]} heading={`${category.emoji} ${category.name}`} />;
}
