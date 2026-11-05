import { create } from "zustand";

/** Whether the install instructions card is open (opened by the timer or the footer link). */
export const useInstallCard = create<{ open: boolean; show: () => void; hide: () => void }>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
