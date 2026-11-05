# 3. Pizzas illustrated in code

**Status:** accepted

## Context

The restaurant has no consistent photography, and the builder needs every topping combination, both halves and every size to look right and animate.

## Decision

Draw pizzas from data: a sauce, cheese and a list of toppings, each defined as SVG. Placement uses a seeded RNG for stable layouts. Finished pizzas are rasterised once to canvas bitmaps and cached; the builder keeps toppings as live SVG so they can animate individually.

## Consequences

- Any pizza on any menu gets matching art for free (`art` in `menu.ts`)
- Bitmaps keep the DOM light on pages with dozens of pizzas
- Non-pizza categories use photos; replace the Unsplash samples with real ones per client
