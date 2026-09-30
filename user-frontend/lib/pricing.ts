import { appConfig } from "@/lib/config";
import type { CartLine, Fulfilment, PriceSummary, Restaurant } from "@/types";

// Display estimate only. The Rails API recalculates every total server-side when orders are created.

const cents = (value: number) => Math.round(value * 100);
const dollars = (value: number) => value / 100;

export type Coupon = {
  code: string;
  description: string;
  type: "percent" | "fixed" | "free_delivery";
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;
};

export const demoCoupons: Coupon[] = [
  { code: "FOOD24", description: "10% off, min $10, max $5", type: "percent", value: 10, minimumOrder: 10, maximumDiscount: 5 },
  { code: "WELCOME", description: "$2 off orders over $8", type: "fixed", value: 2, minimumOrder: 8 },
  { code: "FREEDEL", description: "Free delivery on orders over $5", type: "free_delivery", value: 0, minimumOrder: 5 },
];

export function findCoupon(code: string) {
  return demoCoupons.find((coupon) => coupon.code === code.trim().toUpperCase());
}

export function lineTotal(line: CartLine) {
  return dollars(cents(line.unitPrice) * line.quantity);
}

export function cartSubtotal(lines: CartLine[]) {
  return dollars(lines.reduce((sum, line) => sum + cents(line.unitPrice) * line.quantity, 0));
}

export function couponError(coupon: Coupon | undefined, subtotal: number) {
  if (!coupon) return "This code is not valid.";
  if (subtotal < coupon.minimumOrder) return `Spend at least $${coupon.minimumOrder.toFixed(2)} to use ${coupon.code}.`;
  return null;
}

export function calculateSummary(
  lines: CartLine[],
  restaurant: Restaurant | undefined,
  fulfilment: Fulfilment,
  coupon?: Coupon
): PriceSummary {
  const subtotal = cents(cartSubtotal(lines));
  let deliveryFee = fulfilment === "delivery" && restaurant ? cents(restaurant.deliveryFee) : 0;
  let discount = 0;

  if (fulfilment === "pickup" && restaurant?.pickupDiscountPercent) {
    discount += Math.round((subtotal * restaurant.pickupDiscountPercent) / 100);
  }

  if (coupon && !couponError(coupon, dollars(subtotal))) {
    if (coupon.type === "percent") {
      const raw = Math.round((subtotal * coupon.value) / 100);
      discount += coupon.maximumDiscount ? Math.min(raw, cents(coupon.maximumDiscount)) : raw;
    } else if (coupon.type === "fixed") {
      discount += cents(coupon.value);
    } else {
      deliveryFee = 0;
    }
  }

  discount = Math.min(discount, subtotal);
  const serviceFee = subtotal > 0 ? Math.round(subtotal * appConfig.serviceFeeRate) : 0;
  const total = subtotal - discount + deliveryFee + serviceFee;

  return {
    subtotal: dollars(subtotal),
    discount: dollars(discount),
    deliveryFee: dollars(deliveryFee),
    serviceFee: dollars(serviceFee),
    total: dollars(total),
  };
}
