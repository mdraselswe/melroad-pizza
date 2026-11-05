import { describe, expect, it } from "vitest";
import { TENANTS, type TenantId } from "@/tenants";
import { createTranslator } from "@/i18n";
import { en } from "@/i18n/messages/en";
import { loadTenant, resolveTenantId } from "./tenant";

describe("tenants", () => {
  it.each(Object.keys(TENANTS) as TenantId[])("%s config and menu are valid", (id) => {
    const { tenant, menu } = loadTenant(id);
    expect(tenant.id).toBe(id);
    expect(tenant.pizza.sizes.some((s) => s.id === tenant.pizza.defaultSize)).toBe(true);
    expect(tenant.content[tenant.locale.default]).toBeDefined();

    const pizzaCategories = new Set(menu.categories.filter((c) => c.kind === "pizza").map((c) => c.id));
    for (const item of menu.items.filter((i) => pizzaCategories.has(i.categoryId))) {
      for (const size of tenant.pizza.sizes) {
        expect(item.sizePrices?.[size.id], `${item.id} ${size.id}`).toBeTypeOf("number");
      }
      expect(item.art, item.id).toBeDefined();
    }
    expect(new Set(menu.items.map((i) => i.id)).size).toBe(menu.items.length);
    expect(new Set(menu.deals.map((d) => d.id)).size).toBe(menu.deals.length);
  });

  it("resolves the tenant from the environment", () => {
    expect(resolveTenantId(undefined)).toBe("melroad");
    expect(resolveTenantId("basil-brick")).toBe("basil-brick");
    expect(() => resolveTenantId("nope")).toThrow(/Unknown NEXT_PUBLIC_TENANT/);
  });
});

describe("i18n", () => {
  const t = createTranslator(en);

  it("interpolates variables", () => {
    expect(t("toast.added", { name: "Supreme", price: "$19" })).toBe("Added Supreme · $19");
  });

  it("leaves unknown placeholders visible", () => {
    expect(t("toast.added", { name: "X" })).toBe("Added X · {price}");
  });
});
