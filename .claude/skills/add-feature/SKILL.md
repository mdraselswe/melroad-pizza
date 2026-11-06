---
name: add-feature
description: Add a new feature or page following the project's folder, i18n, testing and static-export conventions.
---

# Add a feature

1. Create `src/features/<name>/` with:
   - `components/` for React components (client components start with `"use client"`)
   - pure logic in `<name>.ts` (or similar) with a colocated `*.test.ts`
   - `index.ts` exporting the public API. Other code imports only `@/features/<name>`.
2. Strings go in `src/i18n/messages/en.ts`; use `t("key", { vars })`.
3. Restaurant-specific values come from `@/config/tenant`. If a new setting is needed, add it to `src/config/schema.ts` with a sensible default and set it in each tenant.
4. Pages: `src/app/<route>/page.tsx` as a server component using `PageShell` and `pageMetadata()`. Add the path to `src/constants/routes.ts` without a trailing slash (`typedRoutes` checks it; the export adds the slash) and to `sitemap.ts` if public. No `useMemo`/`useCallback` for speed: the React Compiler memoises.
5. Anything reading `localStorage`, the clock or search params renders on the client after mount (`useMounted`, `useNow`, `useSearchParams` inside `<Suspense>`).
6. Reuse `src/components/ui` (Button, Sheet, Segmented, Field…) and the tokens in `globals.css`.
7. Add a Playwright check in `tests/e2e/` for the main path.
8. `npm run check`, then `npm run build && npm run test:e2e`.
