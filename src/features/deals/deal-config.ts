import type { Deal, DealSlot, MenuItem } from "@/config/menu-schema";

type PickSlot = Extract<DealSlot, { kind: "pick" }>;

/** Chosen item counts per pick slot: { pizzas: { supreme: 2, pepperoni: 3 } }. */
export type DealPicks = Record<string, Record<string, number>>;

export const pickSlots = (deal: Deal): PickSlot[] =>
  deal.slots.filter((s): s is PickSlot => s.kind === "pick");

export const chosenIn = (picks: DealPicks, slotId: string) =>
  Object.values(picks[slotId] ?? {}).reduce((n, c) => n + c, 0);

export const remainingIn = (picks: DealPicks, slot: PickSlot) => slot.count - chosenIn(picks, slot.id);

/** Adds or removes one of `itemId` in a slot, never exceeding the slot's count or going below zero. */
export function changePick(picks: DealPicks, slot: PickSlot, itemId: string, delta: 1 | -1): DealPicks {
  const current = picks[slot.id]?.[itemId] ?? 0;
  if (delta > 0 && remainingIn(picks, slot) <= 0) {
    // A single-choice slot swaps instead of refusing.
    if (slot.count !== 1) return picks;
    return { ...picks, [slot.id]: { [itemId]: 1 } };
  }
  const next = Math.max(0, current + delta);
  const slotPicks = { ...picks[slot.id], [itemId]: next };
  if (next === 0) delete slotPicks[itemId];
  return { ...picks, [slot.id]: slotPicks };
}

export const dealComplete = (deal: Deal, picks: DealPicks) =>
  pickSlots(deal).every((slot) => remainingIn(picks, slot) === 0);

/** "2× Supreme", "Pepperoni", plus the fixed inclusions, in slot order. */
export function describePicks(deal: Deal, picks: DealPicks, items: ReadonlyMap<string, MenuItem>): string[] {
  return deal.slots.flatMap((slot) => {
    if (slot.kind === "fixed") return [slot.label];
    return Object.entries(picks[slot.id] ?? {}).map(([id, n]) => {
      const name = items.get(id)?.name ?? id;
      return n > 1 ? `${n}× ${name}` : name;
    });
  });
}
