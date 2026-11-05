# 2. Tenants as validated config, chosen at build time

**Status:** accepted

## Context

The template should be resold to other restaurants by changing configuration only.

## Decision

Each restaurant is a folder in `src/tenants/` with `config.ts` and `menu.ts`. `NEXT_PUBLIC_TENANT` selects one at build time. Both files are parsed with zod schemas (`src/config/schema.ts`, `src/config/menu-schema.ts`) that also check references (deal slots → categories/items, defaults → sizes).

## Consequences

- One deployment per restaurant, each fully static and themed
- Invalid data fails the build, not the demo
- Theme colours are injected as CSS variables, so no CSS changes per client
- localStorage keys are namespaced by tenant id
