"use client";

import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Deal } from "@/config/menu-schema";
import { PizzaImage } from "@/features/pizza-art";
import { useSpotlight } from "@/hooks/use-spotlight";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { artFor, dealArt, dealPizzaCount, pickSlotImage } from "@/lib/menu";
import { useDealSheet } from "../deal-sheet-store";

/** Five pizzas fanned across a featured card (positions in px inside a 420×330 box). */
const STACK = [
  { x: 190, y: -10, r: -14, fx: 14, fy: -10 },
  { x: -6, y: 40, r: 16, fx: -16, fy: -4 },
  { x: 180, y: 110, r: -6, fx: 18, fy: 8 },
  { x: 20, y: 140, r: 24, fx: -12, fy: 12 },
  { x: 100, y: 52, r: 8, fx: 0, fy: -14 },
];

function Stack({ deal }: { deal: Deal }) {
  const pizzas = dealArt(deal, STACK.length);
  if (!pizzas.length) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-2.5 -bottom-10 -z-[1] h-[330px] w-[420px] origin-bottom-right max-md:scale-[.68]"
    >
      {STACK.map((s, i) => {
        const pizza = pizzas[i % pizzas.length]!;
        return (
          <span
            key={i}
            className="absolute top-0 left-0 size-[230px] [transform:translate(var(--x),var(--y))_rotate(var(--r))] [filter:drop-shadow(0_16px_18px_var(--shadow))] transition-transform duration-700 ease-[cubic-bezier(.3,1.3,.5,1)] group-hover:[transform:translate(calc(var(--x)*1.08+var(--fx)),calc(var(--y)*1.08+var(--fy)))_rotate(calc(var(--r)*1.8))]"
            style={
              {
                "--x": `${s.x}px`,
                "--y": `${s.y}px`,
                "--r": `${s.r}deg`,
                "--fx": `${s.fx}px`,
                "--fy": `${s.fy}px`,
                zIndex: i === STACK.length - 1 ? STACK.length : i + 1,
              } as CSSProperties
            }
          >
            <PizzaImage art={artFor(pizza)!} px={480} />
          </span>
        );
      })}
    </div>
  );
}

function Corner({ deal }: { deal: Deal }) {
  const pizza = dealArt(deal, 1)[0];
  const image = pizza ? undefined : pickSlotImage(deal);
  if (pizza)
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -bottom-12 -z-[1] size-[170px] rotate-[-12deg] [filter:drop-shadow(0_14px_16px_var(--shadow))] transition-transform duration-700 ease-[cubic-bezier(.3,1.3,.5,1)] group-hover:rotate-[8deg]"
      >
        <PizzaImage art={artFor(pizza)!} px={360} />
      </span>
    );
  if (image)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export
      <img
        src={image}
        alt=""
        loading="lazy"
        className="pointer-events-none absolute -right-8 -bottom-8 -z-[1] size-[150px] rounded-full object-cover opacity-90 shadow-[0_14px_30px_-12px_var(--shadow)] transition-transform duration-700 group-hover:scale-105"
      />
    );
  return null;
}

export function DealCard({
  deal,
  featured = false,
  className,
}: {
  deal: Deal;
  featured?: boolean;
  className?: string;
}) {
  const spotlight = useSpotlight<HTMLButtonElement>();
  const open = useDealSheet((s) => s.open);
  const pizzas = dealPizzaCount(deal);

  return (
    <button
      type="button"
      onClick={() => open(deal.id)}
      onPointerMove={spotlight}
      aria-label={`${deal.name}: ${deal.description}, ${money(deal.price)}. ${t("deals.cta")}`}
      className={cn(
        "glass spotlight group relative flex min-w-0 flex-col gap-2 overflow-hidden rounded-[var(--radius-card)] p-[26px] text-left backdrop-blur-none",
        featured && "beam min-h-[420px] md:col-span-2 md:row-span-2",
        className,
      )}
    >
      <span className="text-[13px] font-semibold tracking-[.12em] text-muted uppercase">{deal.name}</span>
      <h3
        className={cn(
          "m-0 leading-[1.15] font-bold tracking-[-.03em]",
          featured ? "max-w-[14ch] text-[clamp(30px,3.4vw,46px)]" : "max-w-[18ch] text-2xl",
        )}
      >
        {deal.description}
      </h3>
      <div className="mt-auto flex items-baseline gap-2.5 pt-6">
        <b
          className={cn("tracking-[-.04em] tabular-nums", featured ? "text-[64px] leading-none" : "text-4xl")}
        >
          {money(deal.price, true)}
        </b>
        {pizzas > 1 ? (
          <span className="text-sm text-muted">
            {t("deals.per", { price: money(Math.round(deal.price / pizzas)) })}
          </span>
        ) : null}
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
        {t("deals.cta")}
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
      {featured ? <Stack deal={deal} /> : <Corner deal={deal} />}
    </button>
  );
}
