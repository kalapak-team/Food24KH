"use client";

import { useSyncExternalStore } from "react";

type Updater<T> = T | ((previous: T) => T);

export type PersistentStore<T> = {
  get: () => T;
  getServer: () => T;
  set: (updater: Updater<T>) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createPersistentStore<T>(key: string, initial: T): PersistentStore<T> {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      state = initial;
    }
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== key) return;
    loaded = false;
    load();
    listeners.forEach((listener) => listener());
  }

  return {
    get() {
      load();
      return state;
    },
    getServer() {
      return initial;
    },
    set(updater) {
      load();
      state =
        typeof updater === "function" ? (updater as (previous: T) => T)(state) : updater;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage can be unavailable (private mode / quota); in-memory state still works.
      }
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
  };
}

export function useStore<T>(store: PersistentStore<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
