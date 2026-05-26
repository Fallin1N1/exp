"use client";

const CACHE_PREFIX = "expense-tracker:";
const DEFAULT_MAX_AGE_MS = 5 * 60 * 1000;

type CacheEntry<T> = {
  savedAt: number;
  value: T;
};

export const uiCacheKeys = {
  accounts: "accounts",
  transactions: (filter: string) => `transactions:${filter}`,
};

function storageKey(key: string) {
  return `${CACHE_PREFIX}${key}`;
}

export function readUiCache<T>(key: string, maxAgeMs = DEFAULT_MAX_AGE_MS): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(storageKey(key));
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (!entry.savedAt || Date.now() - entry.savedAt > maxAgeMs) {
      window.sessionStorage.removeItem(storageKey(key));
      return null;
    }

    return entry.value;
  } catch {
    window.sessionStorage.removeItem(storageKey(key));
    return null;
  }
}

export function writeUiCache<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  const entry: CacheEntry<T> = {
    savedAt: Date.now(),
    value,
  };

  window.sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
}

export function invalidateUiCache(keys: string[]) {
  if (typeof window === "undefined") return;

  for (const key of keys) {
    window.sessionStorage.removeItem(storageKey(key));
  }
}

export function invalidateUiCachePrefix(prefix: string) {
  if (typeof window === "undefined") return;

  for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = window.sessionStorage.key(index);
    if (key?.startsWith(storageKey(prefix))) {
      window.sessionStorage.removeItem(key);
    }
  }
}
