"use client";

import { tenant } from "@/config/tenant";
import { useNow } from "@/hooks/use-now";
import { useOpenStatus } from "@/hooks/use-open-status";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { groupHours, zonedMoment } from "@/lib/hours";

const rows = groupHours(tenant.hours, t("status.closed"));

/** Opening hours with today's row highlighted and the live open/closed status. */
export function HoursTable() {
  const now = useNow();
  const { status, label } = useOpenStatus();
  const today = now ? zonedMoment(now, tenant.locale.timeZone).day : -1;

  return (
    <div className="grid gap-3">
      <p className="m-0 flex h-6 items-center gap-2 text-[15px] font-semibold" aria-live="polite">
        {status ? (
          <>
            <span
              aria-hidden="true"
              className={cn("ping-dot size-2.5 rounded-full", status.open ? "bg-success" : "bg-danger")}
            />
            {label}
          </>
        ) : null}
      </p>
      <dl className="m-0 grid gap-1">
        {rows.map((row) => {
          const isToday = row.dayIndexes.includes(today);
          return (
            <div
              key={row.days}
              className={cn(
                "flex justify-between gap-4 rounded-xl px-3 py-2 text-[15px]",
                isToday && "bg-faint font-semibold",
              )}
            >
              <dt>
                {row.days}
                {isToday ? (
                  <span className="ml-2 text-[12px] text-accent uppercase">{t("visit.today")}</span>
                ) : null}
              </dt>
              <dd className="m-0 text-right tabular-nums">{row.hours}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
