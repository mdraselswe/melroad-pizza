import type { MenuItem } from "@/config/menu-schema";
import type { Tenant } from "@/config/schema";
import type { Half, Piece } from "@/features/pizza-art";

export interface BuilderState {
  pizzaId: string;
  /** Right half when half & half is on. */
  rightId: string | null;
  sizeId: string;
  baseId: string;
  /** Recipe toppings the customer left off. */
  removed: string[];
  /** Extra ids from the tenant's extras list. */
  extras: string[];
  /** Bumps whenever the pizza itself changes, to replay the build animation. */
  rebuild: number;
}

export type BuilderAction =
  | { type: "pizza"; id: string; fallbackRight?: string }
  | { type: "size"; id: string }
  | { type: "base"; id: string }
  | { type: "toggleTopping"; id: string }
  | { type: "toggleExtra"; id: string }
  | { type: "half"; rightId: string | null }
  | { type: "reset"; state: BuilderState };

const toggle = (list: readonly string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "pizza": {
      if (action.id === state.pizzaId) return state;
      const rightId = state.rightId === action.id ? (action.fallbackRight ?? null) : state.rightId;
      return { ...state, pizzaId: action.id, rightId, removed: [], rebuild: state.rebuild + 1 };
    }
    case "size":
      return { ...state, sizeId: action.id };
    case "base":
      return { ...state, baseId: action.id };
    case "toggleTopping":
      return { ...state, removed: toggle(state.removed, action.id) };
    case "toggleExtra":
      return { ...state, extras: toggle(state.extras, action.id) };
    case "half":
      if (action.rightId === state.rightId || action.rightId === state.pizzaId) return state;
      return { ...state, rightId: action.rightId, removed: [], rebuild: state.rebuild + 1 };
    case "reset":
      return action.state;
  }
}

export function initialBuilderState(pizzaId: string, tenant: Pick<Tenant, "pizza">): BuilderState {
  return {
    pizzaId,
    rightId: null,
    sizeId: tenant.pizza.defaultSize,
    baseId: tenant.pizza.bases[0]!.id,
    removed: [],
    extras: [],
    rebuild: 0,
  };
}

/** Recipe toppings across both halves, in recipe order, without duplicates. */
export function includedToppings(left: MenuItem, right?: MenuItem | null): string[] {
  return [...new Set([...(left.art?.toppings ?? []), ...(right?.art?.toppings ?? [])])];
}

export function halvesFor(left: MenuItem, right?: MenuItem | null): Half[] {
  const toppings = (item: MenuItem) => item.art?.toppings ?? [];
  return right
    ? [
        { side: "L", id: left.id, toppings: toppings(left) },
        { side: "R", id: right.id, toppings: toppings(right) },
      ]
    : [{ side: "F", id: left.id, toppings: toppings(left) }];
}

/** Timing for the drop-in animation (ms). */
export const DROP = { rebuildStart: 380, perWave: 230, perPiece: 26 } as const;

/**
 * Delay for each newly added piece: toppings land in waves (one topping
 * after another) and pieces within a wave are staggered. Pieces that were
 * already on the pizza keep no delay.
 */
export function dropDelays(previous: ReadonlySet<string>, pieces: readonly Piece[], rebuild: boolean) {
  const fresh = pieces.filter((p) => !previous.has(p.key));
  const waves = [...new Set(fresh.map((p) => p.wave))].sort((a, b) => a - b);
  const start = rebuild ? DROP.rebuildStart : 0;
  return new Map(
    fresh.map((p) => [p.key, start + waves.indexOf(p.wave) * DROP.perWave + p.index * DROP.perPiece]),
  );
}
