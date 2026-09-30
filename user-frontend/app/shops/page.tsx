import type { Metadata } from "next";
import { ShopsView } from "@/components/marketplace/shops-view";

export const metadata: Metadata = {
  title: "Shops",
  description: "Groceries, fresh market produce, bakeries, flowers, pet supplies and more delivered across Cambodia.",
  alternates: { canonical: "/shops" },
};

export default function ShopsPage() {
  return <ShopsView />;
}
