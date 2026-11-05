"use client";

import { Gift } from "lucide-react";
import Link from "next/link";
import { NumberTicker } from "@/components/effects/number-ticker";
import { ButtonLink } from "@/components/ui/button";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { useMounted } from "@/hooks/use-mounted";
import { t } from "@/i18n";
import { clockAt, money } from "@/lib/format";
import { listOrders, pointsBalance } from "@/services/orders";
import { rewardProgress } from "../progress";

const RING = 2 * Math.PI * 54;
const integer = new Intl.NumberFormat(tenant.locale.numberLocale, { maximumFractionDigits: 0 }).format;
const dateFormat = new Intl.DateTimeFormat(tenant.locale.numberLocale, {
  timeZone: tenant.locale.timeZone,
  day: "numeric",
  month: "short",
});

function Ring({ fraction }: { fraction: number }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="url(#rewards-ember)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={RING}
        strokeDashoffset={RING * (1 - fraction)}
        className="transition-[stroke-dashoffset] duration-1000 ease-out"
      />
      <defs>
        <linearGradient id="rewards-ember" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--ember-1)" />
          <stop offset="1" stopColor="var(--ember-3)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RewardsView() {
  const mounted = useMounted();
  const { loyalty } = tenant;
  if (!loyalty.enabled) return <p className="m-0 text-lg text-muted">{t("rewards.disabled")}</p>;
  if (!mounted) return <div className="h-[320px] animate-pulse rounded-[var(--radius-panel)] bg-faint" />;

  const orders = listOrders();
  const points = pointsBalance(orders);
  const progress = rewardProgress(points, loyalty.rewardThreshold);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
      <section className="glass beam relative grid justify-items-center gap-4 overflow-hidden rounded-[var(--radius-panel)] p-8 text-center">
        <div className="relative size-[220px]">
          <Ring fraction={progress.fraction} />
          <div className="absolute inset-0 grid place-content-center">
            <NumberTicker
              value={points}
              format={integer}
              className="text-[54px] leading-none font-bold tracking-[-.04em] tabular-nums"
            />
            <small className="text-sm text-muted">{t("rewards.balance")}</small>
          </div>
        </div>
        {progress.rewards > 0 ? (
          <p className="m-0 inline-flex items-center gap-2 text-lg font-semibold text-accent">
            <Gift className="size-5" aria-hidden="true" />
            {t("rewards.ready")} · {money(loyalty.rewardValue * progress.rewards)}
          </p>
        ) : null}
        <p className="m-0 text-muted">{t("rewards.next", { points: progress.toNext })}</p>
        <ButtonLink href={ROUTES.menu}>{t("cart.empty.cta")}</ButtonLink>
      </section>

      <section className="glass grid gap-3 rounded-[var(--radius-panel)] p-[22px]">
        <h2 className="m-0 text-lg font-bold tracking-[-.02em]">{t("rewards.history")}</h2>
        {orders.length ? (
          <ul className="m-0 grid list-none gap-1 p-0">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={ROUTES.order(o.id)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-ink no-underline transition-colors hover:bg-faint"
                >
                  <span className="grid min-w-0 flex-1">
                    <b className="text-[15px]">{o.id}</b>
                    <small className="truncate text-[13px] text-muted">
                      {dateFormat.format(o.createdAt)} · {clockAt(o.createdAt)} ·{" "}
                      {o.lines.map((l) => l.name).join(", ")}
                    </small>
                  </span>
                  <span className="text-right">
                    <b className="block text-[15px] tabular-nums">{money(o.totals.total)}</b>
                    <small className="text-[13px] font-semibold text-accent">+{o.points}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-muted">{t("rewards.none")}</p>
        )}
        {tenant.demo.enabled ? <p className="m-0 text-[13px] text-muted">{t("rewards.demo")}</p> : null}
      </section>
    </div>
  );
}
