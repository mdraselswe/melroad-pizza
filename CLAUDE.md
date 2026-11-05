@AGENTS.md

# Project guide

White-label pizza-shop ordering site (Next.js 16 static export). First tenant: Melroad Pizza n Kebab. Read `docs/tech-spec.md` before larger changes.

## Commands

- `npm run dev` — dev server
- `npm run check` — typecheck + lint + unit tests + build (run before committing)
- `npm run build && npm run test:e2e` — Playwright on the static export
- `NEXT_PUBLIC_TENANT=basil-brick npm run build` — check the second tenant still builds

## Rules

- **No restaurant data in code.** Names, prices, hours, colours and copy come from `src/tenants/<id>/` via `tenant`, `menu`, `content` in `@/config/tenant`.
- **No UI strings in components.** Add keys to `src/i18n/messages/en.ts` and use `t()`. `[word]` in a string renders as the accent word.
- **Money is integer cents** (`Cents`). Format with `money()` from `@/lib/format`; compute with helpers in `@/lib/pricing`.
- **Features import each other only through `@/features/<name>`** (their `index.ts`). ESLint enforces this.
- **Tailwind classes must be literal strings.** Combine with `cn()`.
- Static export: no server actions, API routes or request-time data. Metadata routes need `export const dynamic = "force-static"`.
- Client-only data (cart, orders, time) must not change the server HTML: use `useMounted`, `useNow` or `useCartHydrated`.
- Pure logic goes in `lib/` or a feature's `*.ts` with a colocated `*.test.ts`.
- Respect `prefers-reduced-motion`; animate transform and opacity only.
- Commits: Conventional Commits. husky runs eslint and prettier on staged files.

## Where things are

- Routes: `src/app/*` (thin; compose features)
- Features: `src/features/{cart,checkout,deals,hero,menu,order-tracking,pizza-art,pizza-builder,rewards,visit}`
- Shared UI: `src/components/{ui,layout,effects}`
- Orders seam (swap for a real API): `src/services/orders.ts`

## Skills

`.claude/skills/` has step-by-step guides: `add-tenant`, `add-menu-item`, `add-feature`.
