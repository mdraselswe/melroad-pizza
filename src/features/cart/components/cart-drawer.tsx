"use client";

import { ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { NumberTicker } from "@/components/effects/number-ticker";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { MAX_LINE_QUANTITY } from "@/constants/ordering";
import { t } from "@/i18n";
import { money } from "@/lib/format";
import { loyaltyPoints } from "@/lib/pricing";
import { selectSubtotal, useCartStore } from "../store";
import { LineThumb } from "./line-thumb";

export function CartDrawer() {
  const router = useRouter();
  const open = useCartStore((s) => s.open);
  const setOpen = useCartStore((s) => s.setOpen);
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectSubtotal);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      variant="side"
      title={t("cart.title")}
      closeLabel={t("cart.close")}
      footer={
        lines.length ? (
          <div className="grid gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">{t("cart.subtotal")}</span>
              <NumberTicker
                value={subtotal}
                format={money}
                className="text-2xl font-bold tracking-[-.03em] tabular-nums"
              />
            </div>
            {tenant.loyalty.enabled ? (
              <p className="m-0 text-sm text-muted">
                {t("cart.points", { points: loyaltyPoints(subtotal, tenant.loyalty.pointsPerDollar) })}
              </p>
            ) : null}
            <Button size="lg" className="w-full" onClick={() => go(ROUTES.checkout)}>
              {t("cart.checkout")}
            </Button>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <div className="grid justify-items-center gap-3 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-faint">
            <ShoppingBag className="size-7 text-muted" aria-hidden="true" />
          </span>
          <p className="m-0 text-lg font-semibold">{t("cart.empty.title")}</p>
          <p className="m-0 max-w-[28ch] text-muted">{t("cart.empty.body")}</p>
          <Button variant="ghost" className="mt-2" onClick={() => go(ROUTES.menu)}>
            {t("cart.empty.cta")}
          </Button>
        </div>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0">
          {lines.map((line) => (
            <li key={line.signature} className="flex gap-3 rounded-[20px] border border-line p-3">
              <LineThumb line={line} />
              <div className="grid min-w-0 flex-1 gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="m-0 leading-tight font-semibold">{line.name}</p>
                  <span className="font-semibold tabular-nums">{money(line.unitPrice * line.quantity)}</span>
                </div>
                {line.details.length ? (
                  <p className="m-0 text-[13.5px] leading-snug text-muted">{line.details.join(" · ")}</p>
                ) : null}
                <div className="mt-1 flex items-center justify-between">
                  <Stepper
                    size="sm"
                    value={line.quantity}
                    min={1}
                    max={MAX_LINE_QUANTITY}
                    onChange={(q) => setQuantity(line.signature, q)}
                    decreaseLabel={t("cart.decrease", { name: line.name })}
                    increaseLabel={t("cart.increase", { name: line.name })}
                  />
                  <button
                    type="button"
                    onClick={() => remove(line.signature)}
                    aria-label={t("cart.remove", { name: line.name })}
                    className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-faint hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
