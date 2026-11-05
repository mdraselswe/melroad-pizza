"use client";

import { Check } from "lucide-react";
import { useEffect } from "react";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { useCartStore } from "../store";
import { useToastStore } from "../toast-store";

const VISIBLE_MS = 2600;

export function Toaster() {
  const toast = useToastStore((s) => s.toast);
  const dismiss = useToastStore((s) => s.dismiss);
  const openCart = useCartStore((s) => s.setOpen);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(id);
  }, [toast, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-[calc(20px+env(safe-area-inset-bottom,0px))] left-1/2 z-[85] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-4 text-[15px] font-semibold text-bg shadow-[0_20px_40px_-20px_var(--shadow)] transition-[opacity,translate] duration-300",
        toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0",
      )}
    >
      {toast ? (
        <>
          <span className="ember-fill grid size-6 flex-none place-items-center rounded-full text-white">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
          <span className="truncate">{toast.message}</span>
          <button
            type="button"
            onClick={() => {
              dismiss();
              openCart(true);
            }}
            className="flex-none rounded-full bg-bg/15 px-3 py-1.5 text-sm hover:bg-bg/25"
          >
            {t("toast.view")}
          </button>
        </>
      ) : null}
    </div>
  );
}
