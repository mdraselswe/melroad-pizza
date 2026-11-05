"use client";

import { NumberTicker } from "@/components/effects/number-ticker";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { tenant } from "@/config/tenant";
import { ToppingIcon } from "@/features/pizza-art";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { baseLabel, sizeLabel, toppingLabel } from "@/lib/labels";
import { sizePrice } from "@/lib/pricing";
import { halfOptions, type PizzaBuilder } from "../use-pizza-builder";

const groupLabel = "mb-2.5 block p-0 text-[12.5px] font-semibold tracking-[.12em] text-muted uppercase";
const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-bg py-1.5 pr-3 pl-[7px] text-sm font-medium transition-[transform,border-color,background-color,color] hover:-translate-y-px active:scale-[.96]";

interface BuilderPanelProps {
  builder: PizzaBuilder;
  onAdd: () => void;
  className?: string;
}

export function BuilderPanel({ builder, onAdd, className }: BuilderPanelProps) {
  const { state, dispatch, left, right, size, base, included, price } = builder;
  const halves = halfOptions(left.id);

  return (
    <aside
      aria-label={t("nav.build")}
      className={cn(
        "glass beam relative flex min-w-0 flex-col gap-5 rounded-[var(--radius-panel)] p-[22px] shadow-[0_30px_60px_-40px_var(--shadow)]",
        className,
      )}
    >
      <div>
        <span className={groupLabel}>{t("builder.size")}</span>
        <Segmented
          label={t("builder.size")}
          value={state.sizeId}
          onChange={(id) => dispatch({ type: "size", id })}
          options={tenant.pizza.sizes.map((s) => ({
            id: s.id,
            label: sizeLabel(s.id),
            hint: `${s.inch}" · ${money(sizePrice(left, s.id), true)}`,
          }))}
        />
      </div>
      <div>
        <span className={groupLabel}>{t("builder.base")}</span>
        <Segmented
          label={t("builder.base")}
          value={state.baseId}
          onChange={(id) => dispatch({ type: "base", id })}
          options={tenant.pizza.bases.map((b) => ({
            id: b.id,
            label: baseLabel(b.id),
            hint: b.price ? `+${money(b.price, true)}` : t("builder.includedShort"),
          }))}
        />
      </div>
      <div>
        <span className={groupLabel}>{t("builder.included")}</span>
        {included.length ? (
          <div className="flex flex-wrap gap-1.5">
            {included.map((id) => {
              const off = state.removed.includes(id);
              const name = toppingLabel(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={!off}
                  aria-label={t(off ? "builder.addBack" : "builder.leaveOff", { name })}
                  onClick={() => dispatch({ type: "toggleTopping", id })}
                  className={cn(chip, off && "border-dashed bg-transparent text-muted line-through")}
                >
                  <ToppingIcon
                    id={id}
                    className={cn("size-[22px] flex-none", off && "opacity-35 grayscale")}
                  />
                  {name}
                  <span aria-hidden="true" className="font-bold text-muted">
                    {off ? "+" : "×"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="m-0 text-sm text-muted">{t("builder.noToppings")}</p>
        )}
      </div>
      {tenant.pizza.extras.length ? (
        <div>
          <span className={groupLabel}>{t("builder.extras")}</span>
          <div className="flex flex-wrap gap-1.5">
            {tenant.pizza.extras.map((extra) => {
              const on = state.extras.includes(extra.id);
              return (
                <button
                  key={extra.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => dispatch({ type: "toggleExtra", id: extra.id })}
                  className={cn(
                    chip,
                    on &&
                      "border-transparent [background:linear-gradient(var(--bg),var(--bg))_padding-box,linear-gradient(135deg,var(--ember-3),var(--ember-2))_border-box]",
                  )}
                >
                  <ToppingIcon id={extra.art} className="size-[22px] flex-none" />
                  {toppingLabel(extra.id)}
                  <span
                    className={cn("text-[12.5px] tabular-nums", on ? "font-bold text-accent" : "text-muted")}
                  >
                    {on ? "✓" : t("builder.extraPrice", { price: money(extra.price, true) })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {halves.length ? (
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <span id="half-label" className="text-[15.5px] font-semibold">
              {t("builder.half")}
            </span>
            <Switch
              checked={!!right}
              labelledBy="half-label"
              onChange={(on) => dispatch({ type: "half", rightId: on ? (halves[0]?.id ?? null) : null })}
            />
          </div>
          {right ? (
            <label className="grid gap-1.5">
              <span className="text-[13.5px] text-muted">{t("builder.rightHalf")}</span>
              <select
                className="field appearance-none bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-[length:5px_5px] bg-[position:calc(100%-20px)_50%,calc(100%-15px)_50%] bg-no-repeat pr-9 font-medium"
                value={right.id}
                onChange={(e) => dispatch({ type: "half", rightId: e.target.value })}
              >
                {halves.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}
      <div className="flex items-center gap-3.5 border-t border-line pt-[18px] max-[700px]:sticky max-[700px]:bottom-0 max-[700px]:-mx-[22px] max-[700px]:-mb-[22px] max-[700px]:rounded-b-[var(--radius-panel)] max-[700px]:bg-bg max-[700px]:px-[22px] max-[700px]:pb-[calc(14px+env(safe-area-inset-bottom,0px))]">
        <div className="grid min-w-0 leading-[1.1]">
          <small className="truncate text-[13px] text-muted">
            {sizeLabel(size.id)} {`${size.inch}"`} · {baseLabel(base.id)}
          </small>
          <NumberTicker
            value={price}
            format={money}
            className="text-[32px] font-bold tracking-[-.04em] tabular-nums"
          />
        </div>
        <Button size="lg" className="ml-auto" onClick={onAdd}>
          {t("builder.add")}
        </Button>
      </div>
    </aside>
  );
}
