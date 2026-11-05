"use client";

import { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  format: (value: number) => string;
  duration?: number;
  className?: string;
}

/** Eases from the previous value to the new one (prices in the builder, cart totals). */
export function NumberTicker({ value, format, duration = 450, className }: NumberTickerProps) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const step = (now: number) => {
      const k = reduced ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const next = Math.round(origin + (value - origin) * eased);
      from.current = next;
      setShown(next);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className} aria-label={format(value)}>
      <span aria-hidden="true">{format(shown)}</span>
    </span>
  );
}
