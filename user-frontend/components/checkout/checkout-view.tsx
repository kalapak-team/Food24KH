"use client";

import { Banknote, Bike, Check, CreditCard, Footprints, MapPin, QrCode, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddressForm } from "@/components/address/address-form";
import { CartLineRow, SummaryRows } from "@/components/cart/cart-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAddress, saveAddress } from "@/lib/addresses";
import { clearCart } from "@/lib/cart";
import { getRestaurant } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { useMoney } from "@/lib/money";
import { calculateSummary, couponError, demoCoupons, findCoupon, type Coupon } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { addressesStore, cartStore, ordersStore } from "@/lib/stores";
import { cn } from "@/lib/utils";
import type { Fulfilment, Order } from "@/types";

const paymentMethods = [
  { id: "cash", label: "Cash on delivery", description: "Pay the rider or at the counter", icon: Banknote, available: true },
  { id: "khqr", label: "KHQR", description: "Scan with any Bakong-connected app", icon: QrCode, available: false },
  { id: "aba", label: "ABA Pay", description: "Pay with the ABA Mobile app", icon: CreditCard, available: false },
  { id: "acleda", label: "ACLEDA", description: "Pay with ACLEDA mobile", icon: CreditCard, available: false },
  { id: "wing", label: "Wing", description: "Pay with your Wing wallet", icon: CreditCard, available: false },
] as const;

function Step({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6" aria-labelledby={`step-${index}`}>
      <h2 id={`step-${index}`} className="flex items-center gap-3 font-display text-lg font-bold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm text-white">{index}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function CheckoutView() {
  const t = useT();
  const money = useMoney();
  const router = useRouter();
  const cart = useStore(cartStore);
  const addresses = useStore(addressesStore);
  const restaurant = cart.restaurantSlug ? getRestaurant(cart.restaurantSlug) : undefined;

  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [chosenAddressId, setChosenAddressId] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | undefined>();
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart.lines.length || !restaurant) {
    return <EmptyState emoji="🧾" title={t("emptyCart")} text={t("emptyCartText")} actionLabel={t("browse")} actionHref="/" />;
  }

  const addressId = chosenAddressId ?? (addresses.find((address) => address.isDefault) ?? addresses[0])?.id ?? null;
  const address = addresses.find((item) => item.id === addressId) ?? null;
  const summary = calculateSummary(cart.lines, restaurant, fulfilment, coupon);
  const belowMinimum = summary.subtotal < restaurant.minimumOrder;
  const needsAddress = fulfilment === "delivery" && !address;

  function applyCoupon() {
    const found = findCoupon(couponInput);
    const problem = couponError(found, summary.subtotal);
    if (problem) {
      setCoupon(undefined);
      setCouponMessage(problem);
      return;
    }
    setCoupon(found);
    setCouponMessage(`${found!.code} applied — ${found!.description}`);
  }

  function placeOrder() {
    setError(null);
    if (!restaurant!.isOpen) return setError(`${restaurant!.name} is closed right now.`);
    if (belowMinimum) return setError(`Minimum order is ${money(restaurant!.minimumOrder)}.`);
    if (needsAddress) return setError("Add a delivery address to continue.");
    setPlacing(true);

    const placedAt = new Date();
    const now = placedAt.toISOString();
    const order: Order = {
      id: crypto.randomUUID(),
      number: `F24-${placedAt.getTime().toString().slice(-8)}`,
      restaurantSlug: restaurant!.slug,
      restaurantName: restaurant!.name,
      restaurantEmoji: restaurant!.emoji,
      lines: cart.lines,
      summary,
      couponCode: coupon?.code ?? null,
      fulfilment,
      paymentMethod: "cash",
      paymentStatus: "UNPAID",
      status: "PENDING",
      address: fulfilment === "delivery" ? address : null,
      specialInstructions: instructions.trim(),
      createdAt: now,
      timeline: [{ status: "PENDING", at: now }],
    };
    ordersStore.set((orders) => [order, ...orders]);
    clearCart();
    router.push(`/orders/${order.id}?placed=1`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <Step index={1} title="Delivery or pick-up">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "delivery", label: t("delivery"), text: `${restaurant.deliveryMinutes} ${t("min")} · ${money(restaurant.deliveryFee)}`, icon: Bike },
                {
                  id: "pickup",
                  label: t("pickup"),
                  text: restaurant.pickupDiscountPercent ? `Save ${restaurant.pickupDiscountPercent}% · ${restaurant.address}` : restaurant.address,
                  icon: Footprints,
                },
              ] as const
            ).map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4",
                  fulfilment === option.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary"
                )}
              >
                <input
                  type="radio"
                  name="fulfilment"
                  checked={fulfilment === option.id}
                  onChange={() => setFulfilment(option.id)}
                  className="mt-1 h-5 w-5 accent-[var(--primary)]"
                />
                <span>
                  <span className="flex items-center gap-2 font-semibold">
                    <option.icon className="h-4 w-4 text-primary" aria-hidden /> {option.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{option.text}</span>
                </span>
              </label>
            ))}
          </div>
        </Step>

        {fulfilment === "delivery" && (
          <Step index={2} title="Delivery address">
            {addingAddress || addresses.length === 0 ? (
              <AddressForm
                submitLabel="Use this address"
                onCancel={addresses.length ? () => setAddingAddress(false) : undefined}
                onSubmit={(values) => {
                  const saved = saveAddress(values);
                  setChosenAddressId(saved.id);
                  setAddingAddress(false);
                }}
              />
            ) : (
              <div className="space-y-3">
                {addresses.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4",
                      addressId === item.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary"
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === item.id}
                      onChange={() => setChosenAddressId(item.id)}
                      className="mt-1 h-5 w-5 accent-[var(--primary)]"
                    />
                    <span className="text-sm">
                      <span className="flex items-center gap-2 font-semibold">
                        <MapPin className="h-4 w-4 text-primary" aria-hidden /> {item.label}
                        {item.isDefault && <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-primary">Default</span>}
                      </span>
                      <span className="mt-1 block text-muted">{formatAddress(item)}</span>
                      <span className="block text-muted">
                        {item.recipientName} · {item.phone}
                      </span>
                    </span>
                  </label>
                ))}
                <button type="button" onClick={() => setAddingAddress(true)} className="text-sm font-semibold text-primary hover:underline">
                  + Add a new address
                </button>
              </div>
            )}
          </Step>
        )}

        <Step index={fulfilment === "delivery" ? 3 : 2} title={`Your items from ${restaurant.name}`}>
          <ul className="divide-y divide-border">
            {cart.lines.map((line) => (
              <CartLineRow key={line.key} line={line} />
            ))}
          </ul>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Note for the {restaurant.kind}</span>
            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value.slice(0, 300))}
              rows={2}
              placeholder="Allergies, cutlery, gate code…"
              className="mt-1 w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </Step>

        <Step index={fulfilment === "delivery" ? 4 : 3} title="Payment">
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4",
                  method.available ? "cursor-pointer border-primary bg-primary-soft" : "cursor-not-allowed border-border opacity-60"
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  disabled={!method.available}
                  defaultChecked={method.id === "cash"}
                  className="h-5 w-5 accent-[var(--primary)]"
                />
                <method.icon className="h-5 w-5 text-primary" aria-hidden />
                <span className="flex-1 text-sm">
                  <span className="block font-semibold">{method.label}</span>
                  <span className="text-muted">{method.description}</span>
                </span>
                {!method.available && <span className="rounded-full bg-background px-2 py-1 text-[11px] font-semibold text-muted">Coming soon</span>}
              </label>
            ))}
          </div>
        </Step>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold">Order summary</h2>

          <div className="mt-4">
            <label htmlFor="coupon" className="text-sm font-semibold">
              Voucher code
            </label>
            <div className="mt-1 flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                  placeholder="e.g. FOOD24"
                  className="h-10 w-full rounded-full border border-border pl-9 pr-3 text-sm uppercase outline-none focus:border-primary"
                />
              </div>
              <button type="button" onClick={applyCoupon} disabled={!couponInput.trim()} className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50">
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={cn("mt-2 flex items-center gap-1 text-xs", coupon ? "text-success" : "text-error")} role="status">
                {coupon && <Check className="h-3.5 w-3.5" aria-hidden />} {couponMessage}
              </p>
            )}
            <p className="mt-2 text-[11px] text-muted">Try: {demoCoupons.map((item) => item.code).join(", ")} (development vouchers)</p>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <SummaryRows summary={summary} />
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={placeOrder}
            disabled={placing || belowMinimum || needsAddress || !restaurant.isOpen}
            className="mt-5 h-12 w-full rounded-full bg-primary font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
          >
            {placing ? "Placing order…" : `Place order · ${money(summary.total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Demo mode: orders are saved on this device only. When the Food24KH API is connected, prices and totals are verified by the server.
          </p>
          <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-primary hover:underline">
            Edit cart
          </Link>
        </div>
      </aside>
    </div>
  );
}
