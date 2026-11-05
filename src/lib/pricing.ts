import type { Deal, MenuItem, OptionGroup } from "@/config/menu-schema";
import type { Tenant } from "@/config/schema";
import type { Cents } from "@/types/money";
import { sumCents } from "./money";

export interface PizzaSelection {
  item: MenuItem;
  /** Right half, when the pizza is half & half. */
  half?: MenuItem | null;
  sizeId: string;
  baseId: string;
  extras: readonly string[];
}

type PizzaPricing = Pick<Tenant["pizza"], "bases" | "extras"> & { halfAndHalfFee: Cents };

export function sizePrice(item: MenuItem, sizeId: string): Cents {
  return item.sizePrices?.[sizeId] ?? item.price;
}

/** Half & half is charged at the dearer half plus the split fee. */
export function pizzaPrice(selection: PizzaSelection, pricing: PizzaPricing): Cents {
  const { item, half, sizeId, baseId, extras } = selection;
  const pizza = Math.max(sizePrice(item, sizeId), half ? sizePrice(half, sizeId) : 0);
  const base = pricing.bases.find((b) => b.id === baseId)?.price ?? 0;
  const extrasTotal = sumCents(extras.map((id) => pricing.extras.find((e) => e.id === id)?.price ?? 0));
  return pizza + base + extrasTotal + (half ? pricing.halfAndHalfFee : 0);
}

/** Selected choice ids per option group id. */
export type OptionSelections = Readonly<Record<string, readonly string[]>>;

export function optionsPrice(groups: readonly OptionGroup[], selections: OptionSelections): Cents {
  return sumCents(
    groups.flatMap((g) =>
      (selections[g.id] ?? []).map((id) => g.choices.find((c) => c.id === id)?.price ?? 0),
    ),
  );
}

export const itemPrice = (item: MenuItem, selections: OptionSelections): Cents =>
  item.price + optionsPrice(item.options, selections);

/** Every group has between `min` and `max` choices selected. */
export function optionsComplete(groups: readonly OptionGroup[], selections: OptionSelections): boolean {
  return groups.every((g) => {
    const n = selections[g.id]?.length ?? 0;
    return n >= g.min && n <= g.max;
  });
}

/** What a deal saves against buying its pizzas separately (pick slots with sizes only). */
export function dealSavings(deal: Deal, items: readonly MenuItem[]): Cents {
  const regular = sumCents(
    deal.slots.map((slot) => {
      if (slot.kind !== "pick") return 0;
      const pool = items.filter(
        (i) => slot.itemIds.includes(i.id) || slot.categoryIds.includes(i.categoryId),
      );
      const cheapest = Math.min(...pool.map((i) => (slot.sizeId ? sizePrice(i, slot.sizeId) : i.price)));
      return Number.isFinite(cheapest) ? cheapest * slot.count : 0;
    }),
  );
  return Math.max(0, regular - deal.price);
}

export type FulfilmentMode = "pickup" | "delivery";

export interface OrderTotals {
  subtotal: Cents;
  deliveryFee: Cents;
  total: Cents;
  /** Cents still needed to reach the delivery minimum (0 when met or pickup). */
  belowMinimum: Cents;
}

export function orderTotals(
  subtotal: Cents,
  mode: FulfilmentMode,
  delivery: Tenant["ordering"]["delivery"],
): OrderTotals {
  if (mode === "pickup") return { subtotal, deliveryFee: 0, total: subtotal, belowMinimum: 0 };
  const free = delivery.freeOver !== undefined && subtotal >= delivery.freeOver;
  const deliveryFee = free || subtotal === 0 ? 0 : delivery.fee;
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    belowMinimum: Math.max(0, delivery.minimumOrder - subtotal),
  };
}

export const loyaltyPoints = (total: Cents, pointsPerDollar: number) =>
  Math.floor((total / 100) * pointsPerDollar);
