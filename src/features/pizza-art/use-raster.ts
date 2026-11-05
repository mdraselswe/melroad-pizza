"use client";

import { useEffect, useState } from "react";
import { whenIdle } from "./rasterize";

/**
 * Resolves a rasterised image URL. `key` must change whenever the image
 * would; `idle` defers work until the browser is idle (below-the-fold art).
 */
export function useRaster(key: string | null, make: () => Promise<string>, { idle = false } = {}) {
  const [state, setState] = useState<{ key: string | null; url: string | null }>({ key: null, url: null });

  useEffect(() => {
    if (!key) return;
    let alive = true;
    const run = () =>
      void make().then((url) => {
        if (alive) setState({ key, url });
      });
    const cancel = idle ? whenIdle(run) : (run(), undefined);
    return () => {
      alive = false;
      cancel?.();
    };
    // `make` is derived from `key`; re-running on identity changes would only repeat cached work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, idle]);

  return state.key === key ? state.url : null;
}
