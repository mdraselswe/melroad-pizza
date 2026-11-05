"use client";

import {
  Bike,
  Check,
  ChefHat,
  Flame,
  PartyPopper,
  ReceiptText,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { OrderSummary } from "@/features/checkout";
import { PizzaImage } from "@/features/pizza-art";
import { useMounted } from "@/hooks/use-mounted";
import { useNow } from "@/hooks/use-now";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { clockAt } from "@/lib/format";
import { getOrder, orderStage, stagesFor, type Order, type OrderStage } from "@/services/orders";

const ICONS: Record<OrderStage, LucideIcon> = {
  received: ReceiptText,
  preparing: ChefHat,
  oven: Flame,
  ready: ShoppingBag,
  delivering: Bike,
  done: PartyPopper,
};

function Timeline({ order, stage }: { order: Order; stage: OrderStage }) {
  const stages = stagesFor(order.mode);
  const current = stages.indexOf(stage);
  return (
    <ol className="m-0 grid list-none gap-0 p-0" aria-label={t("order.progress")}>
      {stages.map((s, i) => {
        const Icon = ICONS[s];
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={s}
            aria-current={active ? "step" : undefined}
            className="relative flex items-center gap-4 pb-6 last:pb-0"
          >
            {i < stages.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-10 bottom-0 left-[19px] w-0.5 overflow-hidden rounded bg-line"
              >
                <span
                  className="block w-full bg-accent transition-[height] duration-700 ease-out"
                  style={{ height: done ? "100%" : "0%" }}
                />
              </span>
            ) : null}
            <span
              className={cn(
                "relative grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                done && "border-accent bg-accent text-on-accent",
                active && "border-accent text-accent",
                !done && !active && "border-line text-muted",
              )}
            >
              {active && s !== "done" ? (
                <span aria-hidden="true" className="ping-dot absolute inset-0 rounded-full" />
              ) : null}
              {done ? (
                <Check className="size-[18px]" aria-hidden="true" />
              ) : (
                <Icon className="size-[18px]" aria-hidden="true" />
              )}
            </span>
            <span className={cn("text-[16px] font-semibold", !done && !active && "text-muted")}>
              {t(`order.stage.${s}`)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Hero({ order, stage }: { order: Order; stage: OrderStage }) {
  const pizza = order.lines.find((l) => l.art)?.art;
  return (
    <div className="glass relative isolate grid gap-6 overflow-hidden rounded-[var(--radius-panel)] p-[26px] sm:grid-cols-[1fr_auto]">
      <div className="grid content-start gap-2">
        <p className="m-0 text-xl font-semibold">
          {t("order.thanks", { name: order.customer.name.split(" ")[0]! })}
        </p>
        <p className="m-0 text-muted">
          {t("order.eta", { time: clockAt(order.dueAt) })} ·{" "}
          {order.mode === "delivery" && order.address
            ? t("order.deliverTo", { address: `${order.address.street}, ${order.address.suburb}` })
            : t("order.pickupAt", { address: tenant.contact.address.street })}
        </p>
        {order.points ? (
          <p className="m-0 text-[15px] font-semibold text-accent">
            {t("order.points", { points: order.points })}
          </p>
        ) : null}
        <div className="mt-4">
          <Timeline order={order} stage={stage} />
        </div>
      </div>
      {pizza ? (
        <div
          aria-hidden="true"
          className="relative size-[220px] self-center justify-self-center max-sm:size-[180px]"
        >
          {stage === "oven" ? <span className="steam absolute inset-x-0 -top-4 h-16" /> : null}
          <PizzaImage
            art={pizza}
            px={440}
            className={cn(
              "transition-[filter,transform] duration-1000",
              stage === "received" && "scale-90 opacity-70 grayscale",
              stage === "preparing" && "scale-95 saturate-50",
              stage === "oven" && "animate-[spin_24s_linear_infinite]",
            )}
          />
        </div>
      ) : null}
    </div>
  );
}

function Tracker({ id }: { id: string | null }) {
  const now = useNow(1000);
  const order = getOrder(id);

  if (!order)
    return (
      <div className="glass grid justify-items-start gap-4 rounded-[var(--radius-panel)] p-8">
        <p className="m-0 text-lg">{t("order.notFound")}</p>
        <ButtonLink href={ROUTES.menu}>{t("cart.empty.cta")}</ButtonLink>
      </div>
    );

  const stage = orderStage(order, now?.getTime() ?? order.createdAt);
  return (
    <div className="grid gap-5">
      <h1 className="m-0 text-[clamp(36px,5vw,60px)] leading-none font-bold tracking-[-.04em]">
        <RichText text={t("order.title", { reference: order.id })} />
      </h1>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid gap-3">
          <Hero order={order} stage={stage} />
          {tenant.demo.enabled ? <p className="m-0 px-2 text-[13px] text-muted">{t("order.demo")}</p> : null}
        </div>
        <OrderSummary
          lines={order.lines}
          totals={order.totals}
          showDelivery={order.mode === "delivery"}
          title={t("order.items")}
          showPoints={false}
        >
          <ButtonLink href={ROUTES.menu} variant="ghost" className="w-full">
            {t("order.again")}
          </ButtonLink>
        </OrderSummary>
      </div>
    </div>
  );
}

/** Reads `?id=` and the order from this device; renders nothing on the server. */
export function OrderTracker() {
  const id = useSearchParams().get("id");
  const mounted = useMounted();
  if (!mounted) return <div className="h-[420px] animate-pulse rounded-[var(--radius-panel)] bg-faint" />;
  return <Tracker id={id} />;
}
