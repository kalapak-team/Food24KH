"use client";

import { addLine } from "@/lib/cart";
import { ordersStore } from "@/lib/stores";
import type { Order, OrderStatus } from "@/types";

export const statusFlow: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

export const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Order placed",
  CONFIRMED: "Restaurant confirmed",
  PREPARING: "Preparing your food",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function flowFor(order: Order): OrderStatus[] {
  return order.fulfilment === "pickup" ? statusFlow.filter((status) => status !== "OUT_FOR_DELIVERY") : statusFlow;
}

export function canCancel(order: Order) {
  return order.status === "PENDING";
}

export function cancelOrder(id: string) {
  ordersStore.set((orders) =>
    orders.map((order) =>
      order.id === id && canCancel(order)
        ? { ...order, status: "CANCELLED", timeline: [...order.timeline, { status: "CANCELLED", at: new Date().toISOString() }] }
        : order
    )
  );
}

export function reorder(order: Order) {
  order.lines.forEach((line, index) => addLine(order.restaurantSlug, line, index === 0));
}
