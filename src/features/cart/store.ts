"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { MAX_LINE_QUANTITY } from "@/constants/ordering";
import type { CartLine, NewCartLine } from "./types";

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (line: NewCartLine) => void;
  setQuantity: (signature: string, quantity: number) => void;
  remove: (signature: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

const clamp = (n: number) => Math.max(0, Math.min(MAX_LINE_QUANTITY, Math.round(n)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: ({ quantity = 1, ...line }) =>
        set((state) => {
          const existing = state.lines.find((l) => l.signature === line.signature);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.signature === line.signature ? { ...l, quantity: clamp(l.quantity + quantity) } : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, quantity: clamp(quantity) }] };
        }),
      setQuantity: (signature, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.signature === signature ? { ...l, quantity: clamp(quantity) } : l))
            .filter((l) => l.quantity > 0),
        })),
      remove: (signature) =>
        set((state) => ({ lines: state.lines.filter((l) => l.signature !== signature) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: STORAGE_KEYS.cart,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      skipHydration: true,
    },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
