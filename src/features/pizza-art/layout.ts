import { hashString, seededRandom } from "@/lib/rng";
import { f1, type Rand } from "./shapes";
import { TOPPINGS, type DrizzleTopping } from "./toppings";

/** Radius of the area toppings may land in (the pizza is r=200, sauce ~r=172). */
export const TOPPING_RADIUS = 148;

export type Side = "F" | "L" | "R";

interface Placed {
  x: number;
  y: number;
  gap: number;
  rot: number;
}

export interface PlacedPiece extends Placed {
  kind: "piece";
  key: string;
  toppingId: string;
  side: Side;
  /** Animation wave: toppings drop in one after another. */
  wave: number;
  index: number;
  art: string;
}

export interface DrizzlePiece {
  kind: "drizzle";
  key: string;
  toppingId: string;
  side: Side;
  wave: number;
  index: 0;
  colors: DrizzleTopping["colors"];
  path: string;
}

export type Piece = PlacedPiece | DrizzlePiece;

export interface Half {
  side: Side;
  /** Stable id of what's on this half (the menu item id). */
  id: string;
  toppings: readonly string[];
}

/**
 * Drops pieces at random but non-overlapping spots. Already placed pieces
 * (from earlier toppings) stay put, so adding a topping never moves others.
 */
export function scatter(
  { count, gap, side, rand }: { count: number; gap: number; side: Side; rand: Rand },
  occupied: Placed[],
): Placed[] {
  const out: Placed[] = [];
  for (let tries = 0; out.length < count && tries < count * 80; tries++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * TOPPING_RADIUS;
    const x = Math.cos(a) * d;
    const y = Math.sin(a) * d;
    if ((side === "L" && x > -10) || (side === "R" && x < 10)) continue;
    if (occupied.some((p) => Math.hypot(p.x - x, p.y - y) < (p.gap + gap) / 2)) continue;
    const p = { x, y, gap, rot: rand() * 360 };
    occupied.push(p);
    out.push(p);
  }
  return out;
}

/** A zig-zag sauce drizzle across the pizza. */
export function drizzlePath(): string {
  const pts: [number, number][] = [];
  for (let y = -136, k = 0; y <= 136; y += 22, k++) {
    pts.push([(k % 2 ? 1 : -1) * Math.sqrt(Math.max(0, TOPPING_RADIUS ** 2 - y * y)) * 0.9, y]);
  }
  let d = `M${f1(pts[0]![0])} ${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    d += ` C${f1(x0 * 0.35)} ${y0 + 5} ${f1(x1 * 0.35)} ${y1 - 5} ${f1(x1)} ${y1}`;
  }
  return d;
}

const DRIZZLE_PATH = drizzlePath();

interface PiecesInput {
  halves: readonly Half[];
  /** Topping ids the customer left off. */
  removed?: ReadonlySet<string>;
  /** Extra topping art ids, in display order. */
  extras?: readonly string[];
  /** Every extra that *could* be added, so placements stay stable as extras toggle. */
  extraPool?: readonly string[];
}

/**
 * Lays out every piece for a pizza. Placement is computed for all toppings
 * (including removed ones and the whole extras pool) and filtered at the end,
 * so toggling one topping never reshuffles the rest.
 */
export function piecesFor({
  halves,
  removed = new Set(),
  extras = [],
  extraPool = extras,
}: PiecesInput): Piece[] {
  const signature = halves.map((h) => `${h.side}-${h.id}`).join("|");
  const occupied: Placed[] = [];
  const pieces: (Piece & { base: boolean })[] = []; // `base`: part of the recipe (vs an extra)

  halves.forEach(({ side, toppings }) =>
    toppings.forEach((toppingId, wave) => {
      const topping = TOPPINGS[toppingId];
      if (!topping) return;
      const key = `${signature}:${side}:${toppingId}`;
      if (topping.kind === "drizzle") {
        pieces.push({
          kind: "drizzle",
          key,
          toppingId,
          side,
          wave,
          index: 0,
          colors: topping.colors,
          path: DRIZZLE_PATH,
          base: true,
        });
        return;
      }
      const rand = seededRandom(hashString(key));
      const count = side === "F" ? topping.count : Math.ceil(topping.count * 0.55);
      scatter({ count, gap: topping.gap, side, rand }, occupied).forEach((p, index) =>
        pieces.push({
          ...p,
          kind: "piece",
          key: `${key}:${index}`,
          toppingId,
          side,
          wave,
          index,
          art: topping.draw(rand),
          base: true,
        }),
      );
    }),
  );

  extraPool.forEach((toppingId, n) => {
    const topping = TOPPINGS[toppingId];
    if (!topping || topping.kind !== "piece") return;
    const key = `${signature}:X:${toppingId}`;
    const rand = seededRandom(hashString(key));
    const count = toppingId === "cheese" ? topping.count : Math.ceil(topping.count * 0.6);
    scatter({ count, gap: topping.gap * 0.8, side: "F", rand }, occupied).forEach((p, index) =>
      pieces.push({
        ...p,
        kind: "piece",
        key: `${key}:${index}`,
        toppingId,
        side: "F",
        wave: 10 + n,
        index,
        art: topping.draw(rand),
        base: false,
      }),
    );
  });

  const wanted = new Set(extras);
  return pieces.filter((p) => (p.base ? !removed.has(p.toppingId) : wanted.has(p.toppingId)));
}
