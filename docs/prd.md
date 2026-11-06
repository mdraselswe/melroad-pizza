# Product requirements (PRD)

## Problem

Small takeaway shops (pizza, kebab) usually have a dated website that lists the menu but can't build a custom pizza, show deals well or work as a phone app. Third-party ordering apps take a large cut.

## Product

A fast, premium-looking ordering site that can be resold to many shops. One codebase; each shop is a config folder (`src/tenants/<id>/`). The first tenant is Melroad Pizza n Kebab, Newport VIC.

This version is a **sales demo**: ordering runs fully in the browser and no real payment or kitchen hand-off happens.

## Users

| Who               | Wants                                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| Hungry customer   | See the menu fast on a phone, customise, order pickup or delivery      |
| Returning regular | Re-order quickly, collect rewards, install the site as an app          |
| Shop owner        | A site that matches their brand, shows hours/location, brings orders   |
| Us (reseller)     | Add a new shop in an hour without touching code; host it for near zero |

## Must have (MVP, done)

- Home with hero, open/closed badge, deals, signature pizzas, rewards call-to-action
- Menu with categories, search, item options; pizza builder with half-and-half and live art
- Cart (persists on the device), checkout with pickup/delivery and time slots, order tracker
- Rewards (stamp card), Visit page (hours, map, contact form, socials)
- Dark/light theme, installable app (PWA) that works offline after the first visit
- White-label: brand, colours, menu, hours, copy all from tenant config
- Accessible (keyboard, screen readers, reduced motion), SEO (metadata, sitemap, JSON-LD)

## Later (not in the demo)

- Real order API and payments (`src/services/orders.ts` is the seam)
- Admin to edit menu and prices without a deploy
- Push notifications for order status
- More locales (strings already go through `t()`)

## Success measures

- Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO (mobile)
- Layout shift 0; home page interactive in under 2s on mid-range 4G
- A new tenant builds and passes CI with no code changes outside `src/tenants/`

## Non-goals

- Server-side rendering at request time, user accounts, a CMS
