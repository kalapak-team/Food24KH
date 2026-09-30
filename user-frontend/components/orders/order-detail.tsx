"use client";

import { Check, CircleCheck, MapPin, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SummaryRows } from "@/components/cart/cart-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAddress } from "@/lib/addresses";
import { useMoney } from "@/lib/money";
import { canCancel, cancelOrder, flowFor, reorder, statusLabels } from "@/lib/orders";
import { lineTotal } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { ordersStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

export function OrderDetail({ id, justPlaced }: { id: string; justPlaced: boolean }) {
  const money = useMoney();
  const router = useRouter();
  const orders = useStore(ordersStore);
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return <EmptyState emoji="🔍" title="Order not found" text="This order isn't saved on this device." actionLabel="View my orders" actionHref="/orders" />;
  }

  const flow = flowFor(order);
  const reachedIndex = order.status === "CANCELLED" ? -1 : flow.indexOf(order.status);

  return (
    <div className="space-y-5">
      {justPlaced && order.status === "PENDING" && (
        <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 text-success" role="status">
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-sm">
            <strong>Order placed.</strong> It is waiting for {order.restaurantName} to confirm. Live status updates will appear here once the restaurant dashboard is connected.
          </p>
        </div>
      )}

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Order #{order.number}</p>
            <h1 className="font-display text-2xl font-bold">{order.restaurantName}</h1>
            <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-3xl" aria-hidden>
            {order.restaurantEmoji}
          </span>
        </div>

        <h2 className="mt-6 text-sm font-bold uppercase tracking-wide text-muted">Order status</h2>
        {order.status === "CANCELLED" ? (
          <p className="mt-3 flex items-center gap-2 font-semibold text-error">
            <XCircle className="h-5 w-5" aria-hidden /> This order was cancelled.
          </p>
        ) : (
          <ol className="mt-4 space-y-0">
            {flow.map((status, index) => {
              const done = index <= reachedIndex;
              const current = index === reachedIndex;
              const at = order.timeline.find((entry) => entry.status === status)?.at;
              return (
                <li key={status} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < flow.length - 1 && (
                    <span aria-hidden className={cn("absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5", index < reachedIndex ? "bg-primary" : "bg-border")} />
                  )}
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2",
                      done ? "border-primary bg-primary text-white" : "border-border bg-card text-muted",
                      current && "ring-4 ring-primary/20"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" aria-hidden /> : <span className="h-2 w-2 rounded-full bg-border" />}
                  </span>
                  <div className="pt-1">
                    <p className={cn("font-semibold", !done && "text-muted")}>
                      {status === "READY" && order.fulfilment === "pickup" ? "Ready for pick-up" : statusLabels[status]}
                      {current && <span className="sr-only"> (current status)</span>}
                    </p>
                    {at && <p className="text-xs text-muted">{new Date(at).toLocaleTimeString()}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold">Items</h2>
        <ul className="mt-3 divide-y divide-border">
          {order.lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-3 py-3 text-sm">
              <span>
                <span className="font-semibold">
                  {line.quantity}× {line.name}
                </span>
                {(line.selections.length > 0 || line.addons.length > 0) && (
                  <span className="block text-xs text-muted">
                    {[...line.selections.map((selection) => selection.choiceName), ...line.addons.map((addon) => `+ ${addon.name}`)].join(", ")}
                  </span>
                )}
              </span>
              <span className="shrink-0">{money(lineTotal(line))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-border pt-4">
          <SummaryRows summary={order.summary} />
        </div>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Payment</dt>
            <dd className="font-semibold">Cash · {order.paymentStatus === "UNPAID" ? "Pay on arrival" : order.paymentStatus}</dd>
          </div>
          <div>
            <dt className="text-muted">{order.fulfilment === "delivery" ? "Deliver to" : "Pick-up"}</dt>
            <dd className="flex items-start gap-1 font-semibold">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {order.address ? formatAddress(order.address) : "Collect at the restaurant"}
            </dd>
          </div>
          {order.couponCode && (
            <div>
              <dt className="text-muted">Voucher</dt>
              <dd className="font-semibold">{order.couponCode}</dd>
            </div>
          )}
          {order.specialInstructions && (
            <div>
              <dt className="text-muted">Note</dt>
              <dd className="font-semibold">{order.specialInstructions}</dd>
            </div>
          )}
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            reorder(order);
            router.push("/cart");
          }}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-dark"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Reorder
        </button>
        {canCancel(order) && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Cancel this order?")) cancelOrder(order.id);
            }}
            className="h-12 rounded-full border border-error px-6 font-semibold text-error hover:bg-red-50"
          >
            Cancel order
          </button>
        )}
        <Link href="/orders" className="inline-flex h-12 items-center rounded-full border border-border px-6 font-semibold hover:border-primary">
          All orders
        </Link>
      </div>
    </div>
  );
}
