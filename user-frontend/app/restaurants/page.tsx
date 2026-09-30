import type { Metadata } from "next";
import { Marketplace } from "@/components/marketplace/marketplace";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Browse, filter and sort restaurants delivering near you in Cambodia.",
  alternates: { canonical: "/restaurants" },
};

export default function RestaurantsPage() {
  return <Marketplace mode="delivery" heading="All restaurants" />;
}
