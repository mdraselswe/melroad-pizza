"use client";

import { create } from "zustand";

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toast: Toast | null;
  show: (message: string) => void;
  dismiss: () => void;
}

let counter = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (message) => set({ toast: { id: ++counter, message } }),
  dismiss: () => set({ toast: null }),
}));
