"use client";

import { useMemo, useReducer } from "react";
import { tenant } from "@/config/tenant";
import type { MenuItem } from "@/config/menu-schema";
import { lineSignature } from "@/features/cart";
import { piecesFor, type PizzaArtSpec, type SauceId } from "@/features/pizza-art";
import { baseLabel, sizeLabel, toppingLabel } from "@/lib/labels";
import { findItem, pizzaItems } from "@/lib/menu";
import { pizzaPrice } from "@/lib/pricing";
import { t } from "@/i18n";
import { builderReducer, halvesFor, includedToppings, initialBuilderState } from "./builder-state";

const EXTRAS = tenant.pizza.extras;
const EXTRA_ART_POOL = EXTRAS.map((e) => e.art);
const PRICING = { ...tenant.pizza, halfAndHalfFee: tenant.ordering.halfAndHalfFee };

/** Half & half candidates for the right side, excluding the left pizza. */
export const halfOptions = (leftId: string) => pizzaItems.filter((i) => i.halfAndHalf && i.id !== leftId);

/** All builder state plus everything derived from it (price, pieces, labels, cart line). */
export function usePizzaBuilder(initialPizzaId: string) {
  const [state, dispatch] = useReducer(builderReducer, initialPizzaId, (id) =>
    initialBuilderState(id, tenant),
  );

  const left = findItem(state.pizzaId) ?? pizzaItems[0]!;
  const right: MenuItem | null = state.rightId ? (findItem(state.rightId) ?? null) : null;
  const size = tenant.pizza.sizes.find((s) => s.id === state.sizeId) ?? tenant.pizza.sizes[0]!;
  const base = tenant.pizza.bases.find((b) => b.id === state.baseId) ?? tenant.pizza.bases[0]!;
  const included = includedToppings(left, right);
  const extraArts = state.extras
    .map((id) => EXTRAS.find((e) => e.id === id)?.art)
    .filter((a): a is string => !!a);

  const pieces = useMemo(
    () =>
      piecesFor({
        halves: halvesFor(left, right),
        removed: new Set(state.removed),
        extras: extraArts,
        extraPool: EXTRA_ART_POOL,
      }),
    // extraArts is derived from state.extras
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [left, right, state.removed, state.extras],
  );

  const price = pizzaPrice(
    { item: left, half: right, sizeId: size.id, baseId: base.id, extras: state.extras },
    PRICING,
  );

  const name = right ? `${left.name} & ${right.name}` : left.name;
  const sauce = (left.art?.sauce ?? "tomato") as SauceId;
  const sauceRight = (right?.art?.sauce ?? undefined) as SauceId | undefined;

  const cartLine = () => {
    const removedNames = state.removed.map((id) =>
      t("builder.leaveOffShort", { name: toppingLabel(id).toLowerCase() }),
    );
    const extraNames = state.extras.map((id) =>
      t("builder.extraShort", { name: toppingLabel(id).toLowerCase() }),
    );
    const toppings = [...included.filter((id) => !state.removed.includes(id)), ...extraArts];
    const art: PizzaArtSpec = {
      id: `${left.id}-${right?.id ?? ""}`,
      sauce,
      cheese: left.art?.cheese,
      toppings,
    };
    return {
      signature: lineSignature("pizza", left.id, {
        right: right?.id,
        size: size.id,
        base: base.id,
        removed: state.removed,
        extras: state.extras,
      }),
      kind: "pizza" as const,
      refId: left.id,
      name,
      details: [`${sizeLabel(size.id)} ${size.inch}"`, baseLabel(base.id), ...removedNames, ...extraNames],
      unitPrice: price,
      art,
    };
  };

  return {
    state,
    dispatch,
    left,
    right,
    size,
    base,
    included,
    pieces,
    price,
    name,
    sauce,
    sauceRight,
    cartLine,
  };
}

export type PizzaBuilder = ReturnType<typeof usePizzaBuilder>;
