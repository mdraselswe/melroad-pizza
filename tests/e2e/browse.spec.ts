import { expect, test } from "./fixtures";

test.describe("browsing", () => {
  test("home shows the hero, deals and the studio", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("late-night");
    await expect(page.getByRole("button", { name: /Build this deal/ }).first()).toBeVisible();
    await expect(page.locator("#studio")).toBeAttached();
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
    await expect(page.getByRole("link", { name: "Order now" })).toHaveAttribute("href", "/menu/");
    await expect(page.getByRole("link", { name: /points per \$1/ })).toHaveAttribute("href", "/rewards/");
    const about = page.locator("#about");
    await expect(about.getByRole("heading", { level: 2 })).toContainText("Melbourne Road");
    await expect(about.locator("iframe")).toHaveCount(0); // map waits until scrolled near
    await about.scrollIntoViewIfNeeded();
    await expect(about.locator("iframe")).toHaveAttribute("src", /google\.com\/maps/);
    await expect(about.getByRole("link", { name: /on Facebook/ })).toHaveAttribute("href", /facebook\.com/);
  });

  test("visit page sends a contact message", async ({ page }) => {
    await page.goto("/visit/#contact");
    const form = page.locator("#contact");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByText("Please enter your name")).toBeVisible();
    await form.getByLabel("Name").fill("Sam");
    await form.getByLabel("Email").fill("sam@example.com");
    await form.getByLabel("Message").fill("Do you cater for birthday parties?");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByRole("status")).toContainText("Thanks, Sam!");
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
