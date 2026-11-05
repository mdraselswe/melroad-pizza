import type { Category, Deal, MenuItem } from "@/config/menu-schema";
import { menu } from "@/config/tenant";
import type { PizzaArtSpec } from "@/features/pizza-art";

/** Read-side helpers over the tenant menu. All pure lookups; the menu never changes at runtime. */

const itemById = new Map(menu.items.map((i) => [i.id, i]));
const categoryById = new Map(menu.categories.map((c) => [c.id, c]));
const dealById = new Map(menu.deals.map((d) => [d.id, d]));

export const findItem = (id: string | null | undefined): MenuItem | undefined =>
  id ? itemById.get(id) : undefined;
export const findCategory = (id: string): Category | undefined => categoryById.get(id);
export const findDeal = (id: string | null | undefined): Deal | undefined =>
  id ? dealById.get(id) : undefined;

export const pizzaCategories = menu.categories.filter((c) => c.kind === "pizza");
const pizzaCategoryIds = new Set(pizzaCategories.map((c) => c.id));

export const isPizza = (item: MenuItem) => pizzaCategoryIds.has(item.categoryId) && !!item.art;
export const pizzaItems = menu.items.filter(isPizza);
export const itemsIn = (categoryId: string) => menu.items.filter((i) => i.categoryId === categoryId);

/** The pizza that stars in the hero: the first popular pizza, else the first pizza. */
export const heroPizza: MenuItem | undefined =
  pizzaItems.find((i) => i.tags.includes("popular")) ?? pizzaItems[0];

export function artFor(item: MenuItem): PizzaArtSpec | undefined {
  return item.art
    ? { id: item.id, sauce: item.art.sauce, cheese: item.art.cheese, toppings: item.art.toppings }
    : undefined;
}

/** Items a deal slot can be filled with. */
export function slotPool(slot: { categoryIds: readonly string[]; itemIds: readonly string[] }): MenuItem[] {
  return menu.items.filter((i) => slot.itemIds.includes(i.id) || slot.categoryIds.includes(i.categoryId));
}

/** Number of pizzas in a deal (for "$17.40 a pizza"). */
export function dealPizzaCount(deal: Deal): number {
  return deal.slots.reduce(
    (n, s) => n + (s.kind === "pick" && s.categoryIds.some((id) => pizzaCategoryIds.has(id)) ? s.count : 0),
    0,
  );
}

/** Up to `n` distinct pizzas used to illustrate a deal. */
export function dealArt(deal: Deal, n = 5): MenuItem[] {
  const pool = deal.slots.flatMap((s) => (s.kind === "pick" ? slotPool(s).filter(isPizza) : []));
  const popular = pool.filter((i) => i.tags.includes("popular"));
  const rest = pool.filter((i) => !i.tags.includes("popular"));
  return [...popular, ...rest].slice(0, n);
}

/** A photo for deals without pizzas (kebab or burger combos). */
export function pickSlotImage(deal: Deal): string | undefined {
  for (const slot of deal.slots) {
    if (slot.kind !== "pick") continue;
    const withImage = slotPool(slot).find((i) => i.image);
    if (withImage) return withImage.image;
  }
  return undefined;
}

export const lowestPrice = (item: MenuItem) => Math.min(item.price, ...Object.values(item.sizePrices ?? {}));
