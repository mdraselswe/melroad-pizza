"use client";

import { useCallback, type PointerEvent } from "react";

/** Pointer handler for `.spotlight` cards: moves the glow to follow the cursor. */
export function useSpotlight<T extends HTMLElement>() {
  return useCallback((event: PointerEvent<T>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--sy", `${event.clientY - rect.top}px`);
  }, []);
}
