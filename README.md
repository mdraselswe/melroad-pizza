# Melroad Pizza n Kebab — online ordering demo

A fast, animated, fully static ordering site for **Melroad Pizza n Kebab** (422 Melbourne Road, Newport VIC). It is also a **white-label template**: one config folder per restaurant, so the same code can be demoed to any pizza shop.

- Next.js 16 static export (no server needed), React 19 with the React Compiler, TypeScript 6 strict, Tailwind CSS v4
- Installable app (PWA) that works offline after the first visit
- Pizza art drawn in code: every pizza, topping and the live builder is SVG painted to cached bitmaps
- Menu, pizza studio (sizes, crusts, extras, half & half), deal configurator, cart, checkout, order tracking, rewards
- Light and dark themes, i18n-ready (English today), reduced-motion aware, keyboard and screen-reader friendly
- Demo ordering: orders are saved in the browser only. Nothing is sent to the shop.

## Quick start

Needs Node 24 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # optional: pick a tenant
npm run dev                  # http://localhost:3000
```

| Script             | What it does                                                |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Dev server                                                  |
| `npm run build`    | Static export to `out/`                                     |
| `npm start`        | Serve `out/` locally                                        |
| `npm run check`    | Typecheck, lint, unit tests and build                       |
| `npm test`         | Unit tests (Vitest)                                         |
| `npm run test:e2e` | Playwright tests against `out/` (run `npm run build` first) |
| `npm run images`   | Re-optimise photos from `design/photos-src/` to WebP        |

## Deploy

The site is plain static files in `out/`.

**Vercel:** import the GitHub repo; `vercel.json` sets the build (`npm run build`) and serves `out/` as static files, so nothing else to set. To deploy another restaurant, set the environment variable `NEXT_PUBLIC_TENANT` (for example `basil-brick`).

Any static host (Netlify, Cloudflare Pages, S3) works too: build command `npm run build`, output folder `out`.

Before going live for a real client, update `seo.siteUrl` in the tenant config to the real domain.

## Selling it to another restaurant

See [docs/white-label.md](docs/white-label.md). In short: copy `src/tenants/melroad` to `src/tenants/<client>`, edit `config.ts` (brand, contact, hours, delivery, theme colours, copy) and `menu.ts`, register it in `src/tenants/index.ts`, then build with `NEXT_PUBLIC_TENANT=<client>`. `src/tenants/basil-brick` is a complete second example.

## Docs

- [Product requirements](docs/prd.md): what and why
- [Tech spec](docs/tech-spec.md): architecture, data flow, folders, testing
- [White-label guide](docs/white-label.md)
- [Design system](docs/design-system.md)
- [Architecture decisions](docs/adr/), including held-back package versions

## Credits

Category photos are sample images from Unsplash (see `/credits`). Replace them with the restaurant's own photos before launch.
