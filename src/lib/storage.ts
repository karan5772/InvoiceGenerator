"use client";

import { useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

export function usePersistedState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        // One-time hydration from localStorage after mount — must run after the
        // SSR/first-paint render (which uses `fallback`) to avoid a hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ ...fallback, ...JSON.parse(raw) });
      }
    } catch {
      // ignore malformed local storage
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!isBrowser || !hydrated) return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state, hydrated]);

  return [state, setState, hydrated] as const;
}

export function nextInvoiceNumber(prev: string): string {
  const match = prev.match(/^(.*?)(\d+)(\D*)$/);
  if (!match) return prev;
  const [, prefix, digits, suffix] = match;
  const next = (parseInt(digits, 10) + 1).toString().padStart(digits.length, "0");
  return `${prefix}${next}${suffix}`;
}
