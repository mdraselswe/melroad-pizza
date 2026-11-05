import { describe, expect, it } from "vitest";
import { MenuItemSchema } from "@/config/menu-schema";
import { piecesFor } from "@/features/pizza-art";
import {
  builderReducer,
  dropDelays,
  halvesFor,
  includedToppings,
  initialBuilderState,
  type BuilderState,
} from "./builder-state";

const pizza = (id: string, toppings: string[]) =>
  MenuItemSchema.parse({
    id,
    categoryId: "traditional",
    name: id,
    description: "",
    price: 1600,
    art: { sauce: "tomato", toppings },
  });

const tenant = { pizza: { sizes: [], defaultSize: "L", bases: [{ id: "classic", price: 0 }], extras: [] } };
const start: BuilderState = initialBuilderState("supreme", tenant);

describe("builderReducer", () => {
  it("starts on the default size and first base", () => {
    expect(start).toMatchObject({ pizzaId: "supreme", sizeId: "L", baseId: "classic", rebuild: 0 });
  });

  it("changing pizza clears left-off toppings and replays the build", () => {
    const s = builderReducer({ ...start, removed: ["olive"] }, { type: "pizza", id: "hawaiian" });
    expect(s).toMatchObject({ pizzaId: "hawaiian", removed: [], rebuild: 1 });
    expect(builderReducer(s, { type: "pizza", id: "hawaiian" })).toBe(s);
  });

  it("never makes both halves the same pizza", () => {
    const half = builderReducer(start, { type: "half", rightId: "hawaiian" });
    const swapped = builderReducer(half, { type: "pizza", id: "hawaiian", fallbackRight: "pepperoni" });
    expect(swapped).toMatchObject({ pizzaId: "hawaiian", rightId: "pepperoni" });
    expect(builderReducer(half, { type: "half", rightId: "supreme" })).toBe(half);
  });

  it("toggles toppings and extras", () => {
    let s = builderReducer(start, { type: "toggleTopping", id: "olive" });
    s = builderReducer(s, { type: "toggleExtra", id: "cheese" });
    expect(s).toMatchObject({ removed: ["olive"], extras: ["cheese"] });
    s = builderReducer(s, { type: "toggleTopping", id: "olive" });
    expect(s.removed).toEqual([]);
  });
});

describe("builder helpers", () => {
  const supreme = pizza("supreme", ["salami", "olive"]);
  const hawaiian = pizza("hawaiian", ["ham", "pineapple", "olive"]);

  it("merges toppings across halves without duplicates", () => {
    expect(includedToppings(supreme, hawaiian)).toEqual(["salami", "olive", "ham", "pineapple"]);
  });

  it("splits halves left and right", () => {
    expect(halvesFor(supreme).map((h) => h.side)).toEqual(["F"]);
    expect(halvesFor(supreme, hawaiian).map((h) => h.side)).toEqual(["L", "R"]);
  });

  it("keeps other pieces still when a topping is removed or an extra added", () => {
    const halves = halvesFor(supreme);
    const pool = ["cheese", "mushroom"];
    const all = piecesFor({ halves, extraPool: pool });
    const withoutOlive = piecesFor({ halves, removed: new Set(["olive"]), extraPool: pool });
    const withCheese = piecesFor({ halves, extras: ["cheese"], extraPool: pool });
    const pos = (list: typeof all) =>
      new Map(list.map((p) => [p.key, p.kind === "piece" ? [p.x, p.y] : null]));
    const base = pos(all);
    for (const [key, xy] of pos(withoutOlive)) expect(base.get(key)).toEqual(xy);
    for (const [key, xy] of pos(withCheese)) if (base.has(key)) expect(base.get(key)).toEqual(xy);
    expect(withCheese.some((p) => p.toppingId === "cheese")).toBe(true);
    expect(withoutOlive.some((p) => p.toppingId === "olive")).toBe(false);
  });

  it("keeps half & half toppings on their own side", () => {
    const pieces = piecesFor({ halves: halvesFor(supreme, hawaiian) });
    for (const p of pieces) {
      if (p.kind !== "piece") continue;
      if (p.side === "L") expect(p.x).toBeLessThan(0);
      if (p.side === "R") expect(p.x).toBeGreaterThan(0);
    }
  });

  it("staggers only new pieces, wave by wave", () => {
    const pieces = piecesFor({ halves: halvesFor(supreme) });
    const first = dropDelays(new Set(), pieces, true);
    expect(Math.min(...first.values())).toBe(380);
    const again = dropDelays(new Set(pieces.map((p) => p.key)), pieces, false);
    expect(again.size).toBe(0);
  });
});
