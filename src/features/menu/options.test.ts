import { describe, expect, it } from "vitest";
import { MenuItemSchema } from "@/config/menu-schema";
import { canQuickAdd, defaultSelections, describeSelections, toggleChoice } from "./options";

const kebab = MenuItemSchema.parse({
  id: "doner",
  categoryId: "kebabs",
  name: "Doner",
  description: "",
  price: 1700,
  options: [
    {
      id: "meat",
      label: "Meat",
      min: 1,
      max: 1,
      choices: [
        { id: "lamb", label: "Lamb" },
        { id: "chicken", label: "Chicken" },
      ],
    },
    {
      id: "sauces",
      label: "Sauces",
      min: 0,
      max: 2,
      choices: [
        { id: "garlic", label: "Garlic" },
        { id: "chilli", label: "Chilli" },
        { id: "bbq", label: "BBQ" },
      ],
    },
  ],
});
const [meat, sauces] = kebab.options as [(typeof kebab.options)[number], (typeof kebab.options)[number]];

describe("item options", () => {
  it("preselects required single choices", () => {
    expect(defaultSelections(kebab)).toEqual({ meat: ["lamb"], sauces: [] });
    expect(canQuickAdd(kebab)).toBe(true);
  });

  it("acts like radios for single-choice groups", () => {
    expect(toggleChoice({ meat: ["lamb"] }, meat, "chicken").meat).toEqual(["chicken"]);
    expect(toggleChoice({ meat: ["lamb"] }, meat, "lamb").meat).toEqual(["lamb"]);
  });

  it("caps multi-choice groups at max", () => {
    let s = toggleChoice({}, sauces, "garlic");
    s = toggleChoice(s, sauces, "chilli");
    s = toggleChoice(s, sauces, "bbq");
    expect(s.sauces).toEqual(["garlic", "chilli"]);
    expect(toggleChoice(s, sauces, "garlic").sauces).toEqual(["chilli"]);
  });

  it("describes selections", () => {
    expect(describeSelections(kebab, { meat: ["chicken"], sauces: ["garlic", "bbq"] })).toEqual([
      "Chicken",
      "Garlic, BBQ",
    ]);
  });
});
