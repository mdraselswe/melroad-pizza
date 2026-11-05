# White-label guide

Everything that changes between restaurants lives in one folder: `src/tenants/<id>/`. The app never hard-codes a name, phone number, price or colour.

## Add a restaurant

1. Copy the folder:
   ```bash
   cp -r src/tenants/melroad src/tenants/my-client
   ```
2. Edit `src/tenants/my-client/config.ts`:
   | Field      | What it controls                                                                                                                           |
   | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
   | `id`       | Unique id; also namespaces localStorage keys                                                                                               |
   | `brand`    | Name in the header, full name in titles, tagline                                                                                           |
   | `contact`  | Phone (display + E.164), address, Google Maps link, socials                                                                                |
   | `locale`   | Number locale, currency, time zone (opening hours use it)                                                                                  |
   | `hours`    | 7 arrays, **Sunday first**, of `{ open, close }` in `HH:MM`. A close earlier than open runs past midnight (`16:00`→`01:30`)                |
   | `ordering` | Order reference prefix, slot length, prep times, half & half fee, delivery fee, free-delivery threshold, minimum order, delivery postcodes |
   | `pizza`    | Sizes (inches + visual scale), crusts (+ price), extra toppings (+ price and art)                                                          |
   | `loyalty`  | Turn rewards on/off, points per dollar, reward threshold and value. Off hides the Rewards link                                             |
   | `theme`    | Three gradient colours and the accent for light and dark mode                                                                              |
   | `seo`      | Site URL, title, description, keywords                                                                                                     |
   | `demo`     | Shows the "demo" notices                                                                                                                   |
   | `content`  | Hero headline (`[word]` is styled as the accent), hero text, ring text, stats, About section                                               |
3. Edit `menu.ts`: categories, items (pizzas need `art` so they can be drawn), option groups, tags and deals. Deal slots say which categories or items each pick comes from.
4. Register it in `src/tenants/index.ts`:
   ```ts
   import { myClientConfig } from "./my-client/config";
   import { myClientMenu } from "./my-client/menu";

   export const TENANTS = {
     // …existing tenants
     "my-client": { config: myClientConfig, menu: myClientMenu },
   } satisfies Record<string, TenantBundle>;
   ```
   Rename the exported `melroadConfig` / `melroadMenu` in the copied files to match.
5. Run it:
   ```bash
   NEXT_PUBLIC_TENANT=my-client npm run dev
   ```

Config and menu are validated with zod when the app loads. A typo (an unknown category, a deal pointing at a missing item, a bad colour) fails the build with a clear message, so a broken demo never ships.

## Photos

Put 640px WebP photos in `public/images/menu/` and reference them from `menu.ts`. `npm run images` converts JPGs from `design/photos-src/`. Pizzas don't need photos; they're drawn from their `art` toppings.

## Pizza art

Each pizza lists a sauce and toppings (`art: { sauce, toppings }`). Available toppings are in `src/features/pizza-art/toppings.ts`. To add one, add a shape there and a `topping.<id>` label in `src/i18n/messages/en.ts`.

## Language

All UI text is in `src/i18n/messages/en.ts`. To add a language, add a messages file with the same keys and a `content` entry for that locale in the tenant config.

## Going from demo to real orders

`src/services/orders.ts` is the only place orders are stored. Replace `createOrder`, `getOrder` and `listOrders` with calls to the restaurant's POS or ordering API and set `demo.enabled: false`. The UI depends only on those signatures.
