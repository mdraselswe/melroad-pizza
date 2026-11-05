import type { ReactNode } from "react";
import { tenant } from "@/config/tenant";
import { LineThumb, type CartLine } from "@/features/cart";
import { t } from "@/i18n";
import { money } from "@/lib/format";
import { loyaltyPoints, type OrderTotals } from "@/lib/pricing";

interface OrderSummaryProps {
  lines: readonly CartLine[];
  totals: OrderTotals;
  showDelivery: boolean;
  title?: string;
  /** Show the "earn N points" line (off once the order is placed). */
  showPoints?: boolean;
  children?: ReactNode;
}

/** Line items and totals; shared by checkout and the order tracker. */
export function OrderSummary({
  lines,
  totals,
  showDelivery,
  title = t("checkout.summary"),
  showPoints = true,
  children,
}: OrderSummaryProps) {
  const points =
    showPoints && tenant.loyalty.enabled ? loyaltyPoints(totals.total, tenant.loyalty.pointsPerDollar) : 0;
  return (
    <section aria-label={title} className="glass grid gap-4 rounded-[var(--radius-panel)] p-[22px]">
      <h2 className="m-0 text-lg font-bold tracking-[-.02em]">{title}</h2>
      <ul className="m-0 grid list-none gap-3 p-0">
        {lines.map((line) => (
          <li key={line.signature} className="flex items-center gap-3">
            <LineThumb line={line} className="size-12 shrink-0" />
            <div className="grid min-w-0 flex-1">
              <b className="truncate text-[15px]">
                {line.quantity > 1 ? `${line.quantity} × ` : ""}
                {line.name}
              </b>
              {line.details.length ? (
                <small className="truncate text-[13px] text-muted">{line.details.join(" · ")}</small>
              ) : null}
            </div>
            <span className="text-[15px] font-semibold tabular-nums">
              {money(line.unitPrice * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="m-0 grid gap-1.5 border-t border-line pt-4 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">{t("cart.subtotal")}</dt>
          <dd className="m-0 tabular-nums">{money(totals.subtotal)}</dd>
        </div>
        {showDelivery ? (
          <div className="flex justify-between">
            <dt className="text-muted">{t("checkout.deliveryFee")}</dt>
            <dd className="m-0 tabular-nums">
              {totals.deliveryFee ? money(totals.deliveryFee) : t("checkout.free")}
            </dd>
          </div>
        ) : null}
        <div className="mt-1 flex items-baseline justify-between text-xl font-bold tracking-[-.02em]">
          <dt>{t("checkout.total")}</dt>
          <dd className="m-0 tabular-nums">{money(totals.total)}</dd>
        </div>
        {points ? (
          <p className="m-0 text-[13.5px] font-medium text-accent">{t("cart.points", { points })}</p>
        ) : null}
      </dl>
      {children}
    </section>
  );
}
