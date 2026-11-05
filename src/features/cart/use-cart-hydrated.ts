"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "./store";

const subscribe = (onChange: () => void) => useCartStore.persist.onFinishHydration(onChange);

/** True once the persisted cart has loaded, so pages can tell "empty" from "not loaded yet". */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
