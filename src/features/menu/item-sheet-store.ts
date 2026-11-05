"use client";

import { create } from "zustand";

interface ItemSheetState {
  itemId: string | null;
  open: (itemId: string) => void;
  close: () => void;
}

export const useItemSheet = create<ItemSheetState>()((set) => ({
  itemId: null,
  open: (itemId) => set({ itemId }),
  close: () => set({ itemId: null }),
}));
