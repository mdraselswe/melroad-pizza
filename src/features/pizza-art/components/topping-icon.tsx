import { hashString, seededRandom } from "@/lib/rng";
import { TOPPINGS } from "../toppings";

/** Small inline illustration of one topping, used on chips. Needs <PaintDefs /> on the page. */
export function ToppingIcon({ id, className }: { id: string; className?: string }) {
  const topping = TOPPINGS[id];
  if (!topping) return null;
  const markup =
    topping.kind === "drizzle"
      ? `<path d="M-14 -6 C-4 -14 4 2 14 -6 M-14 6 C-4 -2 4 14 14 6" stroke="${topping.colors[1]}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-14 -6 C-4 -14 4 2 14 -6 M-14 6 C-4 -2 4 14 14 6" stroke="${topping.colors[0]}" stroke-width="1" fill="none" opacity=".4"/>`
      : topping.draw(seededRandom(hashString(id)));
  return (
    <svg
      viewBox="-20 -20 40 40"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
