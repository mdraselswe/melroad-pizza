import type { Category, MenuItem } from "@/config/menu-schema";

const normalise = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/** Every word of the query must appear in the item's name, description, tags or category name. */
export function matchesQuery(item: MenuItem, category: Category | undefined, query: string): boolean {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalise([item.name, item.description, ...item.tags, category?.name ?? ""].join(" "));
  return words.every((w) => haystack.includes(w));
}

export interface MenuSection {
  category: Category;
  items: MenuItem[];
}

/** Categories in menu order with their matching items; empty categories are dropped. */
export function groupMenu(
  categories: readonly Category[],
  items: readonly MenuItem[],
  query = "",
): MenuSection[] {
  return categories
    .map((category) => ({
      category,
      items: items.filter((i) => i.categoryId === category.id && matchesQuery(i, category, query)),
    }))
    .filter((s) => s.items.length > 0);
}
