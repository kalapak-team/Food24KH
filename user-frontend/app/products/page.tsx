import type { Metadata } from "next";
import { ProductsCatalog } from "@/components/marketplace/products-catalog";

export const metadata: Metadata = {
  title: "All dishes",
  description: "Browse 1000 Food24KH dishes with real white-background product photos from PostgreSQL.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold">All dishes</h1>
      <p className="mt-2 text-sm text-muted">Real food photos · loaded live from your pgAdmin PostgreSQL database</p>
      <div className="mt-8">
        <ProductsCatalog />
      </div>
    </div>
  );
}
