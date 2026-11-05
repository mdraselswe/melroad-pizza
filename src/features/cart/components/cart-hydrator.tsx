"use client";

import { useEffect } from "react";
import { useCartStore } from "../store";

/**
 * The cart persists to localStorage with `skipHydration`, so the server and
 * first client render agree (empty cart). Rehydrate once mounted.
 */
export function CartHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}
