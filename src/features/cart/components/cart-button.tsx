"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { t } from "@/i18n";
import { selectCount, useCartStore } from "../store";

/** Header cart button with a live count that bumps whenever something is added. */
export function CartButton() {
  const mounted = useMounted();
  const count = useCartStore(selectCount);
  const setOpen = useCartStore((s) => s.setOpen);
  const ref = useRef<HTMLButtonElement>(null);
  const shown = mounted ? count : 0;

  useEffect(() => {
    const bump = () => {
      const el = ref.current;
      if (!el) return;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "bump .5s cubic-bezier(.3,1.6,.5,1)";
    };
    window.addEventListener("cart:bump", bump);
    return () => window.removeEventListener("cart:bump", bump);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      id="cart-button"
      onClick={() => setOpen(true)}
      aria-label={t("cart.open", { count: shown })}
      className="inline-flex h-[38px] items-center gap-2 rounded-full bg-ink pr-1.5 pl-3.5 text-sm font-semibold text-bg"
    >
      <ShoppingBag className="size-[17px]" aria-hidden="true" />
      <span className="max-sm:hidden">{t("cart.label")}</span>
      <span className="ember-fill inline-grid h-[26px] min-w-[26px] place-items-center rounded-full px-[7px] text-[12.5px] font-bold text-white tabular-nums">
        {shown}
      </span>
    </button>
  );
}
