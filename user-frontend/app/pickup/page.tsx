import type { Metadata } from "next";
import { Marketplace } from "@/components/marketplace/marketplace";

export const metadata: Metadata = {
  title: "Pick-up",
  description: "Order ahead from nearby restaurants and pick it up yourself — no delivery fee.",
  alternates: { canonical: "/pickup" },
};

export default function PickupPage() {
  return <Marketplace mode="pickup" />;
}
