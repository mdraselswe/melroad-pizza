"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has come within `rootMargin` of the viewport, then
 * stays true. Used to defer expensive work (painting, embeds) until needed.
 */
export function useInView<T extends Element>({ rootMargin = "400px", enabled = true } = {}) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(!enabled);

  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);

  return [ref, seen] as const;
}
