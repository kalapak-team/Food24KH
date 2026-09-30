"use client";

import { resolveFoodImage } from "@/lib/food-images";
import { cartStore } from "@/lib/stores";
import type { Addon, CartLine, CartSelection, FoodItem } from "@/types";

export function buildLine(
  food: FoodItem,
  selections: CartSelection[],
  addons: Addon[],
  quantity: number,
  note: string
): CartLine {
  const base = food.discountPrice ?? food.price;
  const extras =
    selections.reduce((sum, selection) => sum + selection.priceDelta, 0) +
    addons.reduce((sum, addon) => sum + addon.price, 0);
  const key = [
    food.id,
    ...selections.map((selection) => `${selection.groupId}:${selection.choiceId}`),
    ...addons.map((addon) => addon.id).sort(),
    note.trim(),
  ].join("|");

  return {
    key,
    foodId: food.id,
    name: food.name,
    emoji: food.emoji,
    imageUrl: resolveFoodImage(food),
    unitPrice: Math.round((base + extras) * 100) / 100,
    quantity,
    selections,
    addons,
    note: note.trim(),
  };
}

export function cartHasOtherRestaurant(restaurantSlug: string) {
  const cart = cartStore.get();
  return cart.lines.length > 0 && cart.restaurantSlug !== restaurantSlug;
}

export function addLine(restaurantSlug: string, line: CartLine, replaceCart = false) {
  cartStore.set((cart) => {
    const lines = replaceCart || cart.restaurantSlug !== restaurantSlug ? [] : cart.lines;
    const existing = lines.find((item) => item.key === line.key);
    return {
      restaurantSlug,
      lines: existing
        ? lines.map((item) =>
            item.key === line.key ? { ...item, quantity: Math.min(item.quantity + line.quantity, 50) } : item
          )
        : [...lines, line],
    };
  });
}

export function changeQuantity(key: string, delta: number) {
  cartStore.set((cart) => {
    const lines = cart.lines
      .map((line) => (line.key === key ? { ...line, quantity: Math.min(line.quantity + delta, 50) } : line))
      .filter((line) => line.quantity > 0);
    return { restaurantSlug: lines.length ? cart.restaurantSlug : null, lines };
  });
}

export function removeLine(key: string) {
  changeQuantity(key, -Infinity);
}

export function clearCart() {
  cartStore.set({ restaurantSlug: null, lines: [] });
}
