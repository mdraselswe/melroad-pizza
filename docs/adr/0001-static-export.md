# 1. Static export, no server

**Status:** accepted

## Context

The site is a sales demo that may be shown to many restaurants. It must be fast, cheap to host and impossible to "go down". Ordering is simulated.

## Decision

Use Next.js `output: "export"`. Every page is prerendered HTML; dynamic parts (cart, checkout, order tracking, rewards, open/closed status) run in the browser. Order ids travel as a query string (`/order/?id=`) instead of a dynamic route, so no server is needed.

## Consequences

- Hosts anywhere as static files; Vercel free tier is enough
- No server actions, API routes or ISR. Metadata routes (`sitemap`, `robots`, `manifest`, `icon.svg`) use `dynamic = "force-static"`
- Real ordering later needs an external API, plugged in at `src/services/orders.ts`
