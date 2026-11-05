---
name: add-tenant
description: Add a new restaurant (tenant) to the white-label pizza site, from its details or website, and verify it builds.
---

# Add a tenant

1. Gather: brand name, address, phone, hours per day, delivery postcodes/fees/minimum, sizes and prices, menu categories and items, deals, two or three brand colours, hero copy.
2. `cp -r src/tenants/basil-brick src/tenants/<id>` (smaller starting point) or copy `melroad` for a large menu.
3. Rename the exports (`<id>Config`, `<id>Menu`) and fill `config.ts`:
   - `hours` is Sunday-first; a close before open runs past midnight.
   - `contact.phoneE164` like `+61387941237`.
   - `ordering.referencePrefix` 1–4 capital letters.
   - `theme.gradient` three hex colours; check text contrast of `accentLight` on the light background and `accentDark` on the dark one.
   - `content.<locale>.heroHeadline` uses `[word]` for the accent word.
4. Fill `menu.ts`. Every pizza needs `art: { sauce, toppings }` using ids from `src/features/pizza-art/toppings.ts`. Deal slots reference category or item ids.
5. Register it in `src/tenants/index.ts`.
6. Verify:
   ```bash
   NEXT_PUBLIC_TENANT=<id> npm run build
   NEXT_PUBLIC_TENANT=<id> npm run dev
   ```
   Zod errors name the bad field. Look at home, menu, build, deals and checkout in light and dark mode.
