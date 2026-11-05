"use client";

import { create } from "zustand";

interface DealSheetState {
  dealId: string | null;
  open: (dealId: string) => void;
  close: () => void;
}

/** Which deal's configurator is open. Any card or link can open it; one <DealSheet /> renders it. */
export const useDealSheet = create<DealSheetState>()((set) => ({
  dealId: null,
  open: (dealId) => set({ dealId }),
  close: () => set({ dealId: null }),
}));
