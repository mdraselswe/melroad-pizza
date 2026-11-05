"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently under the reading line
 * (a thin band `offset` px below the top of the viewport).
 */
export function useScrollSpy(ids: readonly string[], offset = 140): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const sections = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: `-${offset}px 0px -${Math.max(0, window.innerHeight - offset - 40)}px 0px` },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [key, offset]);

  return active;
}
