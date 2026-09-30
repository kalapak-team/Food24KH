"use client";

import { appConfig } from "@/lib/config";
import { useStore } from "@/lib/store";
import { preferencesStore } from "@/lib/stores";
import type { Currency } from "@/types";

export function formatMoney(usd: number, currency: Currency) {
  if (currency === "KHR") {
    const riel = Math.round((usd * appConfig.khrPerUsd) / 100) * 100;
    return `៛${riel.toLocaleString("en-US")}`;
  }
  return `$${usd.toFixed(2)}`;
}

export function useMoney() {
  const { currency } = useStore(preferencesStore);
  return (usd: number) => formatMoney(usd, currency);
}
