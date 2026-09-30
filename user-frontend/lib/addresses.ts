"use client";

import type { AddressFormValues } from "@/components/address/address-form";
import { addressesStore } from "@/lib/stores";
import type { Address } from "@/types";

export function saveAddress(values: AddressFormValues, id?: string): Address {
  const saved: Address = {
    ...values,
    id: id ?? crypto.randomUUID(),
    latitude: null,
    longitude: null,
  };
  addressesStore.set((list) => {
    const isFirst = list.length === 0 || (list.length === 1 && list[0].id === id);
    const makeDefault = saved.isDefault || isFirst;
    const next = id ? list.map((item) => (item.id === id ? { ...saved, isDefault: makeDefault } : item)) : [...list, { ...saved, isDefault: makeDefault }];
    return makeDefault ? next.map((item) => ({ ...item, isDefault: item.id === saved.id })) : next;
  });
  return saved;
}

export function deleteAddress(id: string) {
  addressesStore.set((list) => {
    const next = list.filter((item) => item.id !== id);
    if (next.length && !next.some((item) => item.isDefault)) next[0] = { ...next[0], isDefault: true };
    return next;
  });
}

export function setDefaultAddress(id: string) {
  addressesStore.set((list) => list.map((item) => ({ ...item, isDefault: item.id === id })));
}

export function formatAddress(address: Address) {
  return [address.houseNumber, address.street, address.commune, address.district, address.city].filter(Boolean).join(", ");
}
