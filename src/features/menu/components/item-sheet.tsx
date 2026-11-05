"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { Tag } from "@/components/ui/tag";
import type { MenuItem } from "@/config/menu-schema";
import { MAX_LINE_QUANTITY } from "@/constants/ordering";
import { lineSignature, useAddToCart } from "@/features/cart";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { money } from "@/lib/format";
import { findItem } from "@/lib/menu";
import { itemPrice, optionsComplete } from "@/lib/pricing";
import { useItemSheet } from "../item-sheet-store";
import { defaultSelections, describeSelections, toggleChoice } from "../options";

function ItemConfigurator({ item, onDone }: { item: MenuItem; onDone: () => void }) {
  const [selections, setSelections] = useState(() => defaultSelections(item));
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const unit = itemPrice(item, selections);
  const complete = optionsComplete(item.options, selections);

  const add = () => {
    addToCart({
      signature: lineSignature("item", item.id, selections),
      kind: "item",
      refId: item.id,
      name: item.name,
      details: describeSelections(item, selections),
      unitPrice: unit,
      quantity,
      image: item.image,
    });
    onDone();
  };

  return (
    <Sheet
      open
      onOpenChange={(open) => !open && onDone()}
      title={item.name}
      description={item.description}
      closeLabel={t("item.close")}
      media={
        item.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export
          <img src={item.image} alt="" className="block aspect-[16/9] w-full object-cover" />
        ) : null
      }
      footer={
        <div className="flex items-center gap-3">
          <Stepper
            value={quantity}
            min={1}
            max={MAX_LINE_QUANTITY}
            onChange={setQuantity}
            decreaseLabel={t("item.decrease")}
            increaseLabel={t("item.increase")}
          />
          <Button size="lg" className="flex-1" disabled={!complete} onClick={add}>
            {t("item.add", { quantity, price: money(unit * quantity) })}
          </Button>
        </div>
      }
    >
      {item.tags.length ? (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      ) : null}
      <div className="grid gap-6">
        {item.options.map((group) => {
          const chosen = selections[group.id] ?? [];
          const single = group.max === 1;
          return (
            <fieldset key={group.id} className="m-0 grid gap-2 border-0 p-0">
              <legend className="mb-2 flex w-full items-baseline justify-between p-0">
                <span className="text-[12.5px] font-semibold tracking-[.12em] text-muted uppercase">
                  {group.label}
                </span>
                <span className="text-[13px] text-muted">
                  {group.min > 0 ? t("item.required") : t("item.optional")}
                  {!single ? ` · ${t("item.pickUpTo", { max: group.max })}` : ""}
                </span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.choices.map((choice) => {
                  const on = chosen.includes(choice.id);
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      role={single ? "radio" : "checkbox"}
                      aria-checked={on}
                      onClick={() => setSelections((s) => toggleChoice(s, group, choice.id))}
                      className={cn(
                        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-colors",
                        on ? "border-accent bg-faint text-ink" : "border-line text-muted hover:text-ink",
                      )}
                    >
                      {on ? <Check className="size-4 text-accent" aria-hidden="true" /> : null}
                      {choice.label}
                      {choice.price ? (
                        <span className="text-[13px] text-muted">+{money(choice.price, true)}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>
    </Sheet>
  );
}

/** Mount once per page that lists menu items. */
export function ItemSheet() {
  const itemId = useItemSheet((s) => s.itemId);
  const close = useItemSheet((s) => s.close);
  const item = findItem(itemId);
  return item ? <ItemConfigurator key={item.id} item={item} onDone={close} /> : null;
}
