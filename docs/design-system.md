# Design system: "Ember"

Warm, glowing and food-first. The site should feel like an open oven at night, not a template.

## Colour

Tokens are CSS variables in `src/app/globals.css`, with light and dark sets, mapped to Tailwind colours through `@theme inline`.

| Token                   | Use                                                            |
| ----------------------- | -------------------------------------------------------------- |
| `bg`, `bg-2`            | Page background (warm off-white / near-black brown)            |
| `glass`, `line`         | Cards and hairlines                                            |
| `ink`, `muted`, `faint` | Text, secondary text, subtle fills                             |
| `accent`, `on-accent`   | Calls to action and the highlighted word in headings           |
| `ember-1..3`            | The tenant's three-stop gradient (shimmer buttons, rings, 404) |
| `success`, `danger`     | Open/closed, errors, tags                                      |

Tenant colours (`theme.gradient`, `accentLight`, `accentDark`) are injected on `<html>`, so each client gets their own palette without touching CSS.

## Type

- **Geist** for everything: tight tracking on headings (−0.04em), 15–17px body
- **Instrument Serif italic** only for the accent word in headings, written as `[word]` in copy and rendered by `RichText`

## Shape and depth

- Radii: cards 22px, panels 26px, pills fully rounded
- `glass` cards: translucent fill, 1px border, soft brown shadow
- Grain overlay and dotted backgrounds add texture; `horizon` adds a warm glow behind page headings

## Motion

- Entrances: `rise` and `blur-in` (headline), `Reveal` on scroll
- Delight: toppings drop with a spring, the plate spins on rebuild, deal pizzas fan out on hover, shimmer on primary buttons, cart button bumps
- Always: animate transform and opacity only; everything is disabled under `prefers-reduced-motion`

## Components

`Button`/`ButtonLink` (primary, ghost, solid, quiet), `Sheet` (side or centre, with media and footer slots), `Segmented`, `Switch`, `Stepper`, `Tag`, `Field`, `SectionHeading`, `PageShell`. Prefer these over one-off markup.

## Tailwind rules

Write class names as literal strings (no string building), so Tailwind can find them. Use `cn()` to combine conditional classes.
