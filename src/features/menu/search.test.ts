import { describe, expect, it } from "vitest";
import { CategorySchema, MenuItemSchema } from "@/config/menu-schema";
import { groupMenu, matchesQuery } from "./search";

const pizzas = CategorySchema.parse({ id: "pizza", name: "Pizza", kind: "pizza" });
const sides = CategorySchema.parse({ id: "sides", name: "Sides", kind: "standard" });
const items = [
  MenuItemSchema.parse({
    id: "marg",
    categoryId: "pizza",
    name: "Margherita",
    description: "Tomato, mozzarella",
    price: 1600,
    tags: ["vegetarian"],
  }),
  MenuItemSchema.parse({
    id: "jalapeno",
    categoryId: "pizza",
    name: "Jalapeño Heat",
    description: "Chilli",
    price: 1800,
  }),
  MenuItemSchema.parse({ id: "chips", categoryId: "sides", name: "Chips", description: "", price: 600 }),
];

describe("menu search", () => {
  it("matches name, description, tags and category, ignoring accents and case", () => {
    expect(matchesQuery(items[0]!, pizzas, "MOZZ")).toBe(true);
    expect(matchesQuery(items[0]!, pizzas, "vegetarian pizza")).toBe(true);
    expect(matchesQuery(items[1]!, pizzas, "jalapeno")).toBe(true);
    expect(matchesQuery(items[2]!, sides, "pizza")).toBe(false);
  });

  it("groups by category and drops empty ones", () => {
    expect(groupMenu([pizzas, sides], items).map((s) => s.items.length)).toEqual([2, 1]);
    expect(groupMenu([pizzas, sides], items, "chips").map((s) => s.category.id)).toEqual(["sides"]);
  });
});
