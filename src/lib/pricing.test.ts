import { describe, expect, it } from "vitest";
import { DealSchema, MenuItemSchema, OptionGroupSchema } from "@/config/menu-schema";
import { dealSavings, itemPrice, loyaltyPoints, optionsComplete, orderTotals, pizzaPrice } from "./pricing";

const pizza = (id: string, M: number, L: number) =>
  MenuItemSchema.parse({
    id,
    categoryId: "traditional",
    name: id,
    description: "",
    price: M,
    sizePrices: { M, L },
  });

const PRICING = {
  bases: [
    { id: "classic", price: 0 },
    { id: "gf", price: 400 },
  ],
  extras: [
    { id: "cheese", art: "cheese", price: 200 },
    { id: "prawn", art: "prawn", price: 300 },
  ],
  halfAndHalfFee: 200,
};

describe("pizzaPrice", () => {
  const supreme = pizza("supreme", 1600, 1900);
  const gourmet = pizza("tandoori", 1800, 2300);

  it("adds size, base and extras", () => {
    expect(pizzaPrice({ item: supreme, sizeId: "L", baseId: "classic", extras: [] }, PRICING)).toBe(1900);
    expect(
      pizzaPrice({ item: supreme, sizeId: "M", baseId: "gf", extras: ["cheese", "prawn"] }, PRICING),
    ).toBe(1600 + 400 + 500);
  });

  it("charges the dearer half plus the split fee", () => {
    expect(
      pizzaPrice({ item: supreme, half: gourmet, sizeId: "L", baseId: "classic", extras: [] }, PRICING),
    ).toBe(2300 + 200);
  });
});

describe("item options", () => {
  const sauces = OptionGroupSchema.parse({
    id: "sauces",
    label: "Sauces",
    min: 1,
    max: 2,
    choices: [
      { id: "garlic", label: "Garlic" },
      { id: "cheese", label: "Cheese", price: 150 },
      { id: "bbq", label: "BBQ" },
    ],
  });
  const kebab = MenuItemSchema.parse({
    id: "k",
    categoryId: "kebabs",
    name: "Kebab",
    description: "",
    price: 1700,
    options: [sauces],
  });

  it("prices chosen options", () => {
    expect(itemPrice(kebab, { sauces: ["garlic", "cheese"] })).toBe(1850);
  });

  it("validates min and max", () => {
    expect(optionsComplete(kebab.options, {})).toBe(false);
    expect(optionsComplete(kebab.options, { sauces: ["garlic"] })).toBe(true);
    expect(optionsComplete(kebab.options, { sauces: ["garlic", "bbq", "cheese"] })).toBe(false);
  });
});

describe("dealSavings", () => {
  it("compares against the cheapest eligible pizzas", () => {
    const items = [pizza("a", 1600, 1900), pizza("b", 1700, 2000)];
    const deal = DealSchema.parse({
      id: "party",
      name: "Party",
      description: "",
      price: 8700,
      slots: [
        { kind: "pick", id: "p", label: "5 large", count: 5, categoryIds: ["traditional"], sizeId: "L" },
      ],
    });
    expect(dealSavings(deal, items)).toBe(5 * 1900 - 8700);
  });
});

describe("orderTotals", () => {
  const delivery = {
    enabled: true,
    prepMinutes: 40,
    fee: 500,
    freeOver: 6000,
    minimumOrder: 2500,
    postcodes: [],
  };

  it("never charges delivery on pickup", () => {
    expect(orderTotals(1000, "pickup", delivery)).toEqual({
      subtotal: 1000,
      deliveryFee: 0,
      total: 1000,
      belowMinimum: 0,
    });
  });

  it("adds the fee and reports the minimum", () => {
    expect(orderTotals(2000, "delivery", delivery)).toEqual({
      subtotal: 2000,
      deliveryFee: 500,
      total: 2500,
      belowMinimum: 500,
    });
  });

  it("delivers free over the threshold", () => {
    expect(orderTotals(6000, "delivery", delivery).deliveryFee).toBe(0);
  });
});

it("awards loyalty points per whole dollar", () => {
  expect(loyaltyPoints(4599, 10)).toBe(459);
});
