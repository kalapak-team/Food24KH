"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { useMoney } from "@/lib/money";
import { statusLabels } from "@/lib/orders";
import { useStore } from "@/lib/store";
import { ordersStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function OrdersList() {
  const money = useMoney();
  const orders = useStore(ordersStore);

  if (!orders.length) {
    return <EmptyState emoji="🧾" title="You have no orders yet" text="When you place an order it will appear here." actionLabel="Find something to eat" actionHref="/" />;
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link href={`/orders/${order.id}`} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary-soft text-2xl" aria-hidden>
              {order.restaurantEmoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{order.restaurantName}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    order.status === "CANCELLED" ? "bg-red-50 text-error" : order.status === "DELIVERED" ? "bg-green-50 text-success" : "bg-primary-soft text-primary"
                  )}
                >
                  {statusLabels[order.status]}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted">
                #{order.number} · {new Date(order.createdAt).toLocaleString()} · {order.lines.reduce((sum, line) => sum + line.quantity, 0)} items
              </p>
            </div>
            <p className="font-bold">{money(order.summary.total)}</p>
            <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
