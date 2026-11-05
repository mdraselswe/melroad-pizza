import type { PizzaArtSpec } from "@/features/pizza-art";
import type { Cents } from "@/types/money";

export type CartLineKind = "pizza" | "item" | "deal";

/**
 * A snapshot of something in the cart. Name, details and price are captured
 * when added so the cart and order history render without the menu.
 */
export interface CartLine {
  /** Lines with the same signature (same thing, same options) merge. */
  signature: string;
  kind: CartLineKind;
  refId: string;
  name: string;
  details: string[];
  unitPrice: Cents;
  quantity: number;
  art?: PizzaArtSpec;
  image?: string;
}

export type NewCartLine = Omit<CartLine, "quantity"> & { quantity?: number };
