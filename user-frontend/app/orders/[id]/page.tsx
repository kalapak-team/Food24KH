import type { Metadata } from "next";
import { OrderDetail } from "@/components/orders/order-detail";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { placed } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <OrderDetail id={id} justPlaced={placed === "1"} />
    </div>
  );
}
