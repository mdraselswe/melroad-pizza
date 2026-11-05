import { addSide, expect, openCart, test } from "./fixtures";

test.describe("ordering", () => {
  test("build a pizza and add it to the cart", async ({ page }) => {
    await page.goto("/build/?pizza=hawaiian");
    await expect(page.getByRole("heading", { level: 3, name: "Hawaiian" })).toBeVisible();
    await page.getByRole("radio", { name: /XL/ }).click();
    await page.getByRole("button", { name: /Add to order/ }).click();
    const cart = await openCart(page);
    await expect(cart.getByText("Hawaiian")).toBeVisible();
    await expect(cart.getByText(/XL/).first()).toBeVisible();
  });

  test("item options sheet adds a configured kebab", async ({ page }) => {
    await page.goto("/menu/");
    await page.getByRole("button", { name: "Choose Doner Kebab" }).click();
    const sheet = page.getByRole("dialog");
    await sheet.getByRole("radio", { name: "Chicken" }).click();
    await sheet.getByRole("checkbox", { name: "Garlic" }).click();
    await sheet.getByRole("button", { name: /^Add 1/ }).click();
    const cart = await openCart(page);
    await expect(cart.getByText("Chicken")).toBeVisible();
  });

  test("deal configurator adds a deal once complete", async ({ page }) => {
    await page.goto("/deals/");
    await page
      .getByRole("button", { name: /Build this deal/ })
      .first()
      .click();
    const sheet = page.getByRole("dialog");
    const incomplete = sheet.getByRole("button", { name: /^Choose \d+ more/ });
    await expect(incomplete).toBeDisabled();
    for (const radio of await sheet.getByRole("radiogroup").all())
      await radio.getByRole("radio").first().click();
    const plus = sheet.getByRole("button", { name: /^Add one more/ }).first();
    for (let i = 0; i < 10 && (await incomplete.count()); i++) await plus.click();
    await sheet.getByRole("button", { name: /^Add deal/ }).click();
    const cart = await openCart(page);
    await expect(cart.getByRole("listitem").first()).toBeVisible();
  });

  test("checkout places a pickup order and tracks it", async ({ page }) => {
    await addSide(page);
    await page.goto("/checkout/");
    await page.getByLabel("Name").fill("Test Customer");
    await page.getByLabel("Mobile").fill("0412 345 678");

    const slot = page.getByLabel("Time");
    if (await slot.isVisible()) await slot.selectOption({ index: 1 });

    await page.getByRole("button", { name: /^Place order/ }).click();
    await expect(page).toHaveURL(/\/order\/\?id=MR-/);
    await expect(page.getByText("Thanks, Test!")).toBeVisible();
    await expect(page.getByRole("list", { name: "Order progress" })).toBeVisible();

    await page.goto("/rewards/");
    await expect(page.getByRole("link", { name: /MR-/ })).toBeVisible();
  });

  test("checkout validates delivery details", async ({ page }) => {
    await addSide(page);
    await page.goto("/checkout/");
    await page.getByRole("radio", { name: /Delivery/ }).click();
    await expect(page.getByText(/more for delivery/)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Place order/ })).toBeDisabled();
    await page.getByLabel("Name").focus();
    await page.getByLabel("Postcode").fill("3000");
    await page.getByLabel("Postcode").blur();
    await expect(page.getByText(/don't deliver to 3000/)).toBeVisible();
    await expect(page.getByText("Please enter your name")).toBeVisible();
  });
});
