"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import type { Deal } from "@/config/menu-schema";
import { menu } from "@/config/tenant";
import { lineSignature, useAddToCart } from "@/features/cart";
import { PizzaImage } from "@/features/pizza-art";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { artFor, dealArt, findDeal, slotPool } from "@/lib/menu";
import {
  changePick,
  chosenIn,
  dealComplete,
  describePicks,
  pickSlots,
  remainingIn,
  type DealPicks,
} from "../deal-config";
import { useDealSheet } from "../deal-sheet-store";

const itemsById = new Map(menu.items.map((i) => [i.id, i]));

function DealConfigurator({ deal, onDone }: { deal: Deal; onDone: () => void }) {
  const [picks, setPicks] = useState<DealPicks>({});
  const addToCart = useAddToCart();
  const complete = dealComplete(deal, picks);
  const left = pickSlots(deal).reduce((n, s) => n + remainingIn(picks, s), 0);
  const fixed = deal.slots.filter((s) => s.kind === "fixed");
  const cover = dealArt(deal, 1)[0];

  const add = () => {
    addToCart({
      signature: lineSignature(
        "deal",
        deal.id,
        Object.fromEntries(
          Object.entries(picks).map(([k, v]) => [k, Object.entries(v).map(([id, n]) => `${id}x${n}`)]),
        ),
      ),
      kind: "deal",
      refId: deal.id,
      name: deal.name,
      details: describePicks(deal, picks, itemsById),
      unitPrice: deal.price,
      art: cover ? artFor(cover) : undefined,
      image: cover ? undefined : slotPool(pickSlots(deal)[0] ?? { categoryIds: [], itemIds: [] })[0]?.image,
    });
    onDone();
  };

  return (
    <Sheet
      open
      onOpenChange={(open) => !open && onDone()}
      title={deal.name}
      description={`${deal.description} · ${money(deal.price, true)}`}
      closeLabel={t("deal.close")}
      footer={
        <Button size="lg" className="w-full" disabled={!complete} onClick={add}>
          {complete ? t("deal.add", { price: money(deal.price) }) : t("deal.incomplete", { left })}
        </Button>
      }
    >
      <div className="grid gap-6">
        {pickSlots(deal).map((slot) => {
          const chosen = chosenIn(picks, slot.id);
          return (
            <fieldset key={slot.id} className="m-0 grid gap-2 border-0 p-0">
              <legend className="mb-2 flex w-full items-baseline justify-between gap-3 p-0">
                <span className="text-[12.5px] font-semibold tracking-[.12em] text-muted uppercase">
                  {slot.label}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    chosen === slot.count ? "text-success" : "text-accent",
                  )}
                  aria-live="polite"
                >
                  {t("deal.chosen", { chosen, count: slot.count })}
                </span>
              </legend>
              <ul className="m-0 grid list-none gap-2 p-0">
                {slotPool(slot).map((item) => {
                  const n = picks[slot.id]?.[item.id] ?? 0;
                  const art = artFor(item);
                  const full = remainingIn(picks, slot) <= 0 && slot.count > 1;
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 rounded-[18px] border p-2.5 pr-3 transition-colors",
                        n > 0 ? "border-accent bg-faint" : "border-line",
                      )}
                    >
                      {art ? (
                        <PizzaImage art={art} px={140} className="size-12 flex-none" />
                      ) : item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- static export
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="size-12 flex-none rounded-xl object-cover"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="m-0 leading-tight font-semibold">{item.name}</p>
                        <p className="m-0 line-clamp-1 text-[13px] text-muted">{item.description}</p>
                      </div>
                      {slot.count === 1 ? (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={n > 0}
                          aria-label={item.name}
                          onClick={() => setPicks((p) => changePick(p, slot, item.id, 1))}
                          className={cn(
                            "grid size-8 flex-none place-items-center rounded-full border transition-colors",
                            n > 0 ? "ember-fill border-transparent text-white" : "border-line",
                          )}
                        >
                          {n > 0 ? <Check className="size-4" aria-hidden="true" /> : null}
                        </button>
                      ) : (
                        <Stepper
                          size="sm"
                          value={n}
                          max={full ? n : slot.count}
                          onChange={(v) => setPicks((p) => changePick(p, slot, item.id, v > n ? 1 : -1))}
                          decreaseLabel={t("cart.decrease", { name: item.name })}
                          increaseLabel={t("cart.increase", { name: item.name })}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          );
        })}
        {fixed.length ? (
          <div className="grid gap-2">
            <span className="text-[12.5px] font-semibold tracking-[.12em] text-muted uppercase">
              {t("deal.includes")}
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {fixed.map((s) => (
                <li
                  key={s.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium"
                >
                  <Check className="size-3.5 text-success" aria-hidden="true" />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}

/** Mount once per page that shows deals. */
export function DealSheet() {
  const dealId = useDealSheet((s) => s.dealId);
  const close = useDealSheet((s) => s.close);
  const deal = findDeal(dealId);
  // Keyed so picks reset for each deal.
  return deal ? <DealConfigurator key={deal.id} deal={deal} onDone={close} /> : null;
}
