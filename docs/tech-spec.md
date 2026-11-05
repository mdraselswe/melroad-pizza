# Tech spec

## Goals

- Feels instant: static HTML on a CDN, small client bundles, images painted in the browser
- Looks premium: warm "Ember" visual language, motion that respects reduced-motion
- Easy to resell: all restaurant data in a validated tenant config
- Easy to maintain: feature folders, pure helpers with unit tests, e2e on the deployed build

## Stack

| Concern    | Choice                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Framework  | Next.js 16 App Router, `output: "export"` (static), Turbopack                                  |
| UI         | React 19 (React Compiler lint rules), Tailwind CSS v4, Radix Dialog, lucide icons              |
| Motion     | CSS keyframes for most effects, `motion` for the builder's topping drops                       |
| State      | zustand (cart, persisted per tenant; sheet open state)                                         |
| Forms      | react-hook-form + zod                                                                          |
| Validation | zod schemas for tenant config, menu and checkout                                               |
| Tests      | Vitest + Testing Library (unit), Playwright desktop + mobile (e2e)                             |
| Quality    | ESLint (Next + React hooks + import boundaries), Prettier, husky + lint-staged, GitHub Actions |

## Folders

```
src/
  app/                 routes only: page shells, metadata, sitemap/robots/manifest/icon
  components/          shared, feature-agnostic UI
    ui/                buttons, sheet, segmented control, field, tag…
    layout/            header, footer, page shell, theme script/toggle
    effects/           reveal, number ticker, marquee, ember canvas
  config/              zod schemas + the loaded tenant (`tenant`, `menu`, `content`)
  constants/           routes, storage keys, timings, nav, credits
  features/<name>/     one folder per feature; import only from its index.ts
    cart  checkout  deals  hero  menu  order-tracking  pizza-art  pizza-builder  rewards  visit
  hooks/               generic hooks (now, mounted, open status, theme, scroll spy, spotlight)
  i18n/                messages + typed `t()`
  lib/                 pure helpers: money, pricing, hours, slots, menu lookups, ids, storage, seo
  services/            orders (demo: localStorage; swap for an API)
  tenants/<id>/        config.ts + menu.ts per restaurant
tests/e2e/             Playwright specs
```

The ESLint rule `no-restricted-imports` blocks deep imports into another feature, so features stay decoupled behind their `index.ts`.

## Data flow

1. `src/config/tenant.ts` reads `NEXT_PUBLIC_TENANT`, validates the tenant config and menu with zod, and exports `tenant`, `menu` and `content`. This runs at build time, so pages are fully prerendered.
2. Pages are server components that compose feature components. Interactive parts are client components.
3. Prices are integer cents everywhere (`src/lib/pricing.ts`). The cart stores snapshots (name, details, unit price, art) so the cart and order history render without the menu.
4. The cart persists to `localStorage` under `<tenant>:cart` with `skipHydration`. `CartHydrator` loads it after mount so server and client HTML match.
5. Checkout validates with `checkoutSchema(delivery)`, builds the order through `createOrder`, clears the cart and routes to `/order/?id=…`.
6. The tracker derives the stage from elapsed time (`orderStage`), so it needs no backend.

## Pizza art

- `pizza-art/toppings.ts` defines each topping as SVG pieces or drizzles. `layout.ts` scatters them with a seeded RNG, so a pizza always looks the same and adding an extra doesn't reshuffle the others.
- `rasterize.ts` paints SVG to a canvas once and caches the PNG blob URL (in idle time). Menu cards, deals and the hero show these bitmaps.
- The builder draws the base as a bitmap and the toppings as live SVG, so each topping can drop in and out with `motion`.
- Shared gradients and filters are rendered once (`<PaintDefs/>`) in the layout.

## Time and hours

Hours are evaluated in the tenant's time zone (`zonedMoment`). Windows that close after midnight count toward the previous day. `buildSlots` creates pickup/delivery times from the prep time and slot grid, only while open.

## Performance

- Fully static, no server or database at runtime
- Fonts: Geist and Instrument Serif via `next/font`, `display: swap`
- Photos: 640px WebP (~30–40 KB), lazy-loaded; pizza bitmaps generated client-side at the needed size
- Heavy effects (ember canvas, parallax) pause off-screen and respect `prefers-reduced-motion`

## Accessibility

Skip link, landmark structure, one `h1` per page, labelled radio groups and switches, focus-visible styles, `aria-live` for the builder and status, dialogs via Radix (focus trap, Escape), and colour tokens chosen for readable contrast in both themes.

## Testing

- Unit tests sit next to the code (`*.test.ts`): pricing, hours, slots, tenant validation, i18n, builder reducer, deal picks, item options, menu search, checkout schema, order service, reward progress.
- E2E (`tests/e2e`) runs on the production export in desktop Chrome and a Pixel 7 profile: browsing, search, 404, theme, builder, options sheet, deal configurator, checkout validation, placing and tracking an order.
- CI runs typecheck, lint, format check, unit tests, both tenant builds and e2e on every push.

## Out of scope for the demo

Real payments, sending orders to the shop, accounts, and server-side order storage. `services/orders.ts` is the seam for adding them.
