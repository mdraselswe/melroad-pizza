import { expect, test } from "./fixtures";

test.describe("browsing", () => {
  test("home shows the hero, deals and the studio", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("late-night");
    await expect(page.getByRole("button", { name: /Build this deal/ }).first()).toBeVisible();
    await expect(page.locator("#studio")).toBeAttached();
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
  });

  test("every main page renders its heading", async ({ page }) => {
    for (const [path, text] of [
      ["/menu/", "menu"],
      ["/deals/", "deal"],
      ["/build/", "pizza"],
      ["/rewards/", "Slices"],
      ["/visit/", "hi"],
      ["/credits/", "credits"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(text);
    }
  });

  test("menu search filters and clears", async ({ page }) => {
    await page.goto("/menu/");
    const search = page.getByRole("searchbox", { name: "Search the menu" });
    await search.fill("adana");
    await expect(page.getByRole("heading", { level: 3 }).filter({ hasText: "Adana" }).first()).toBeVisible();
    await expect(page.locator("#cat-traditional")).toHaveCount(0);
    await search.fill("zzzz");
    await expect(page.getByText(/Nothing matches/)).toBeVisible();
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.locator("#cat-traditional")).toBeVisible();
  });

  test("unknown pages show the 404", async ({ page }) => {
    const res = await page.goto("/no-such-page/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("missing");
  });

  test("theme toggle switches to dark", async ({ page }) => {
    await page.goto("/visit/");
    const toggle = page.getByRole("button", { name: /^Theme/ });
    for (let i = 0; i < 3 && (await page.locator("html").getAttribute("data-theme")) !== "dark"; i++) {
      await toggle.click();
    }
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
