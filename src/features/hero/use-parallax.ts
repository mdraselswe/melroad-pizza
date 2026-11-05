"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pointer parallax for every `[data-depth]` element inside `root`. One rAF
 * loop eases toward the cursor and only writes `translate` (no layout). It
 * sleeps when the pointer is still and is off for touch and reduced motion.
 * `data-depth` is the travel in px at the screen edge; negative moves against the cursor.
 */
export function useParallax(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const layers = [...host.querySelectorAll<HTMLElement>("[data-depth]")].map(
      (el) => [el, Number(el.dataset.depth) || 0] as const,
    );
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      for (const [el, depth] of layers)
        el.style.translate = `${(x * depth).toFixed(2)}px ${(y * depth).toFixed(2)}px`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0015 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [root]);
}
