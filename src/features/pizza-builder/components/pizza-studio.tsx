"use client";

import { useId, useRef, useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { useAddToCart } from "@/features/cart";
import { RichText } from "@/components/ui/rich-text";
import { tenant } from "@/config/tenant";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { itemsIn, pizzaCategories } from "@/lib/menu";
import { flyToCart } from "../fly-to-cart";
import { halfOptions, usePizzaBuilder } from "../use-pizza-builder";
import { BuilderPanel } from "./builder-panel";
import { PizzaPlate } from "./pizza-plate";

interface PizzaStudioProps {
  initialPizzaId: string;
}

/** Menu list · live pizza · options panel. Used on the home page and the /build page. */
export function PizzaStudio({ initialPizzaId }: PizzaStudioProps) {
  const builder = usePizzaBuilder(initialPizzaId);
  const { state, dispatch, left, right, size, pieces, sauce, sauceRight, name } = builder;
  const [range, setRange] = useState(left.categoryId);
  const addToCart = useAddToCart();
  const plateRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const list = itemsIn(range).filter((i) => i.art);

  const add = () => {
    const line = builder.cartLine();
    void flyToCart(plateRef.current).then(() => addToCart(line));
  };

  return (
    <div className="grid items-start gap-7 max-[700px]:grid-cols-1 max-[700px]:gap-[18px] max-lg:grid-cols-[210px_minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)_360px]">
      <nav aria-label={t("builder.menuLabel")} className="grid min-w-0 gap-3">
        {pizzaCategories.length > 1 ? (
          <Segmented
            label={t("builder.range")}
            value={range}
            onChange={setRange}
            options={pizzaCategories.map((c) => ({ id: c.id, label: c.name.replace(/ pizzas?/i, "") }))}
          />
        ) : null}
        <ul className="no-scrollbar m-0 flex list-none flex-col gap-1 p-0 max-[700px]:-mx-4 max-[700px]:flex-row max-[700px]:overflow-x-auto max-[700px]:px-4 lg:max-h-[640px] lg:overflow-y-auto">
          {list.map((item) => {
            const active = item.id === state.pizzaId;
            return (
              <li key={item.id} className="flex-none">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    dispatch({ type: "pizza", id: item.id, fallbackRight: halfOptions(item.id)[0]?.id })
                  }
                  className={cn(
                    "grid w-full gap-0.5 rounded-2xl border px-3.5 py-[11px] text-left transition-colors max-[700px]:rounded-full max-[700px]:px-[15px] max-[700px]:py-2",
                    active
                      ? "glass border-line text-ink"
                      : "border-transparent text-muted hover:text-ink max-[700px]:border-line",
                  )}
                >
                  <strong className="flex items-center gap-2 text-lg font-semibold tracking-[-.02em] max-[700px]:text-[15px]">
                    {item.name}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="ember-fill size-[7px] rounded-full shadow-[0_0_10px_var(--ember-1)]"
                      />
                    ) : null}
                  </strong>
                  <small
                    className={cn(
                      "overflow-hidden text-[13.5px] leading-[1.45] text-muted transition-[max-height,opacity] duration-400 max-[700px]:hidden",
                      active ? "max-h-[90px] opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {item.description}
                  </small>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative flex min-w-0 flex-col items-center gap-[18px]" aria-live="polite">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2%] left-1/2 aspect-square w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_70%)] blur-[20px]"
        />
        <div ref={plateRef} className="relative flex w-full justify-center">
          <PizzaPlate
            pieces={pieces}
            baseId={state.baseId}
            sauce={sauce}
            sauceRight={sauceRight}
            cheese={left.art?.cheese}
            scale={size.scale}
            half={!!right}
            rebuild={state.rebuild}
            labelledBy={titleId}
          />
        </div>
        <div className="relative text-center">
          <h3
            id={titleId}
            className="m-0 text-[clamp(36px,4.6vw,58px)] leading-none font-bold tracking-[-.045em]"
          >
            {right ? <RichText text={`${left.name} [&] ${right.name}`} /> : name}
          </h3>
          <p className="mx-auto mt-2.5 mb-0 max-w-[46ch] text-[15.5px] text-muted">
            {right
              ? t("builder.halfDesc", {
                  left: left.name,
                  right: right.name,
                  fee: money(tenant.ordering.halfAndHalfFee),
                })
              : left.description}
          </p>
        </div>
      </div>

      <BuilderPanel builder={builder} onAdd={add} className="max-lg:col-span-full lg:sticky lg:top-[92px]" />
    </div>
  );
}
