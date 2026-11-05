---
name: add-menu-item
description: Add or change a menu item, option group, topping or deal in a tenant menu.
---

# Add a menu item

1. Open `src/tenants/<id>/menu.ts`. Use the helpers at the top (`pizza()`, `item()`, `choices()`, `deal()`).
2. Prices are integer cents (`1700` = $17). Pizzas use `sizePrices` keyed by size id.
3. Options: `{ id, label, min, max, choices }`. `min: 1, max: 1` is a required single choice (radio); `max > 1` gives checkboxes. Items with options open the options sheet; items without go straight to the cart.
4. Tags: `popular`, `vegetarian`, `vegan`, `spicy`, `halal`, `seafood`, `new`.
5. Pizza art: `art: { sauce: "tomato" | "bbq" | "garlic" | "creamy" | "tandoori" | "nutella", toppings: [...] }`.
   New topping: add its shape in `src/features/pizza-art/toppings.ts` and `topping.<id>` in `src/i18n/messages/en.ts`.
6. Deals: slots are `{ kind: "pick", count, categoryIds | itemIds, sizeId? }` or `{ kind: "fixed", label }`. Set `featured: true` to show on the home page.
7. Run `npm test` (the tenant test validates every menu) and check `/menu` and `/deals`.
