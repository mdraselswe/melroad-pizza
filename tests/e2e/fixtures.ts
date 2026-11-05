import { test as base, expect, type Page } from "@playwright/test";

/** Every test starts with an empty cart and order history and reduced motion, so runs are fast and stable. */
export const test = base.extend({
  page: async ({ page }, run) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("e2e-init")) {
        localStorage.clear();
        sessionStorage.setItem("e2e-init", "1");
      }
    });
    await run(page);
  },
});

export { expect };

export async function openCart(page: Page) {
  await page.locator("#cart-button").click();
  return page.getByRole("dialog");
}

/** Adds a no-options menu item from the Sides category. */
export async function addSide(page: Page) {
  await page.goto("/menu/");
  await page.locator("#cat-sides").getByRole("button", { name: /^Add / }).first().click();
  await expect(page.getByRole("status").filter({ hasText: /added/i })).toBeVisible();
}
