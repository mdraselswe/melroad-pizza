"use client";

import { useCallback } from "react";
import { t } from "@/i18n";
import { money } from "@/lib/format";
import { useCartStore } from "./store";
import { useToastStore } from "./toast-store";
import type { NewCartLine } from "./types";

/** Adds a line, bumps the cart button and shows a toast. */
export function useAddToCart() {
  const add = useCartStore((s) => s.add);
  const show = useToastStore((s) => s.show);
  return useCallback(
    (line: NewCartLine) => {
      add(line);
      show(t("toast.added", { name: line.name, price: money(line.unitPrice * (line.quantity ?? 1)) }));
      window.dispatchEvent(new CustomEvent("cart:bump"));
    },
    [add, show],
  );
}
