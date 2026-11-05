"use client";

import { useSearchParams } from "next/navigation";
import { findItem, heroPizza, isPizza } from "@/lib/menu";
import { PizzaStudio } from "./pizza-studio";

function FromParams() {
  const requested = findItem(useSearchParams().get("pizza"));
  const pizza = requested && isPizza(requested) ? requested : heroPizza;
  return pizza ? <PizzaStudio key={pizza.id} initialPizzaId={pizza.id} /> : null;
}

/** The /build studio; opens on `?pizza=<id>` when given, else the hero pizza. */
export function BuildStudio({ fromSearchParams = false }: { fromSearchParams?: boolean }) {
  if (fromSearchParams) return <FromParams />;
  return heroPizza ? <PizzaStudio initialPizzaId={heroPizza.id} /> : null;
}
