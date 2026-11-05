import { describe, expect, it } from "vitest";
import { DealSchema, MenuItemSchema } from "@/config/menu-schema";
import { changePick, chosenIn, dealComplete, describePicks, pickSlots, type DealPicks } from "./deal-config";

const deal = DealSchema.parse({
  id: "d",
  name: "Deal",
  description: "",
  price: 3500,
  slots: [
    { kind: "pick", id: "pizzas", label: "2 pizzas", count: 2, categoryIds: ["traditional"] },
    { kind: "pick", id: "kebab", label: "Kebab", count: 1, itemIds: ["doner", "falafel"] },
    { kind: "fixed", id: "can", label: "A can" },
  ],
});
const [pizzas, kebab] = pickSlots(deal) as [
  ReturnType<typeof pickSlots>[number],
  ReturnType<typeof pickSlots>[number],
];

describe("deal config", () => {
  it("adds up to the slot count and no further", () => {
    let picks: DealPicks = {};
    picks = changePick(picks, pizzas, "supreme", 1);
    picks = changePick(picks, pizzas, "supreme", 1);
    picks = changePick(picks, pizzas, "pepperoni", 1);
    expect(picks.pizzas).toEqual({ supreme: 2 });
    expect(chosenIn(picks, "pizzas")).toBe(2);
  });

  it("removes and cleans up zero counts", () => {
    const picks = changePick({ pizzas: { supreme: 1 } }, pizzas, "supreme", -1);
    expect(picks.pizzas).toEqual({});
    expect(changePick(picks, pizzas, "supreme", -1).pizzas).toEqual({});
  });

  it("swaps the choice in single-pick slots", () => {
    const picks = changePick(changePick({}, kebab, "doner", 1), kebab, "falafel", 1);
    expect(picks.kebab).toEqual({ falafel: 1 });
  });

  it("knows when every slot is filled", () => {
    expect(dealComplete(deal, { pizzas: { a: 2 } })).toBe(false);
    expect(dealComplete(deal, { pizzas: { a: 1, b: 1 }, kebab: { doner: 1 } })).toBe(true);
  });

  it("describes the picks for the cart", () => {
    const items = new Map(
      ["supreme", "doner"].map((id) => [
        id,
        MenuItemSchema.parse({ id, categoryId: "x", name: id.toUpperCase(), description: "", price: 0 }),
      ]),
    );
    expect(describePicks(deal, { pizzas: { supreme: 2 }, kebab: { doner: 1 } }, items)).toEqual([
      "2× SUPREME",
      "DONER",
      "A can",
    ]);
  });
});
