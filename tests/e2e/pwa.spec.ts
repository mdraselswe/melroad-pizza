import { expect, test } from "./fixtures";

test.describe("installable app", () => {
  test("manifest lists PNG and maskable icons that exist", async ({ page, request }) => {
    await page.goto("/");
    const href = await page.locator('link[rel="manifest"]').getAttribute("href");
    const manifest = await (await request.get(href!)).json();
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#0a0807");
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
    for (const icon of manifest.icons) {
      const res = await request.get(icon.src);
      expect(res.ok(), icon.src).toBe(true);
    }
    const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
    expect((await request.get(apple!)).headers()["content-type"]).toContain("image/png");
  });

  test("works offline after the first visit", async ({ page, context }) => {
    await page.goto("/");
    // The worker precaches the whole site, then claims this page.
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 30_000 });

    await context.setOffline(true);
    await page.goto("/menu/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("menu");
    await expect(page.getByRole("status").filter({ hasText: /offline/ })).toBeVisible();
    await page.goto("/build/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("pizza");
    await context.setOffline(false);
  });

  test("footer link opens install instructions", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Install the app" }).click();
    const card = page.getByRole("dialog", { name: /Install Melroad/ });
    await expect(card).toBeVisible();
    await expect(card.getByRole("listitem").first()).toBeVisible();
    await card.getByRole("button", { name: "Close install instructions" }).click();
    await expect(card).toBeHidden();
  });
});
