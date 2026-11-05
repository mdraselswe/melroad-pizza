import { z } from "zod";

const cents = z.number().int().nonnegative();

export const ItemTagSchema = z.enum(["popular", "vegetarian", "vegan", "spicy", "halal", "seafood", "new"]);

export const OptionChoiceSchema = z.object({ id: z.string(), label: z.string(), price: cents.default(0) });

/** A group of choices on an item, e.g. "Pick 3 sauces" (min 3, max 3). */
export const OptionGroupSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
    choices: z.array(OptionChoiceSchema).min(1),
  })
  .refine((g) => g.min <= g.max && g.max <= g.choices.length, "min ≤ max ≤ number of choices");

export const SauceBaseSchema = z.enum(["tomato", "bbq", "garlic", "creamy", "tandoori", "nutella"]);

/** How the pizza illustration for an item is painted. */
export const PizzaArtSchema = z.object({
  sauce: SauceBaseSchema,
  cheese: z.boolean().default(true),
  toppings: z.array(z.string()),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  /** "pizza" items open the pizza builder; everything else opens the item sheet. */
  kind: z.enum(["pizza", "standard"]),
  image: z.string().optional(),
});

export const MenuItemSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string(),
  description: z.string(),
  /** Base price. Pizzas use `sizePrices` instead. */
  price: cents,
  sizePrices: z.record(z.string(), cents).optional(),
  image: z.string().optional(),
  art: PizzaArtSchema.optional(),
  options: z.array(OptionGroupSchema).default([]),
  tags: z.array(ItemTagSchema).default([]),
  /** Eligible to be one half of a half & half pizza. */
  halfAndHalf: z.boolean().default(false),
});

/**
 * A deal is a list of slots. "pick" slots let the customer choose `count`
 * items from some categories and/or specific items; "fixed" slots are simply
 * included (garlic bread, a can…).
 */
export const DealSlotSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("pick"),
    id: z.string(),
    label: z.string(),
    count: z.number().int().positive(),
    categoryIds: z.array(z.string()).default([]),
    itemIds: z.array(z.string()).default([]),
    /** Pizza size that is included in the deal price. */
    sizeId: z.string().optional(),
  }),
  z.object({ kind: z.literal("fixed"), id: z.string(), label: z.string() }),
]);

export const DealSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: cents,
  featured: z.boolean().default(false),
  slots: z.array(DealSlotSchema).min(1),
});

export const MenuSchema = z
  .object({
    categories: z.array(CategorySchema).min(1),
    items: z.array(MenuItemSchema).min(1),
    deals: z.array(DealSchema),
  })
  .superRefine((menu, ctx) => {
    const categoryIds = new Set(menu.categories.map((c) => c.id));
    const itemIds = new Set(menu.items.map((i) => i.id));
    menu.items.forEach((item, index) => {
      if (!categoryIds.has(item.categoryId))
        ctx.addIssue({
          code: "custom",
          path: ["items", index, "categoryId"],
          message: `Unknown category ${item.categoryId}`,
        });
    });
    menu.deals.forEach((deal, d) =>
      deal.slots.forEach((slot, s) => {
        if (slot.kind !== "pick") return;
        const path = ["deals", d, "slots", s];
        if (slot.categoryIds.length + slot.itemIds.length === 0)
          ctx.addIssue({ code: "custom", path, message: "A pick slot needs categoryIds or itemIds" });
        slot.categoryIds.forEach((id) => {
          if (!categoryIds.has(id)) ctx.addIssue({ code: "custom", path, message: `Unknown category ${id}` });
        });
        slot.itemIds.forEach((id) => {
          if (!itemIds.has(id)) ctx.addIssue({ code: "custom", path, message: `Unknown item ${id}` });
        });
      }),
    );
  });

export type ItemTag = z.infer<typeof ItemTagSchema>;
export type OptionChoice = z.infer<typeof OptionChoiceSchema>;
export type OptionGroup = z.infer<typeof OptionGroupSchema>;
export type SauceBase = z.infer<typeof SauceBaseSchema>;
export type PizzaArt = z.infer<typeof PizzaArtSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type DealSlot = z.infer<typeof DealSlotSchema>;
export type Deal = z.infer<typeof DealSchema>;
export type Menu = z.infer<typeof MenuSchema>;
export type MenuInput = z.input<typeof MenuSchema>;
