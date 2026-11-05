import { PizzaImage } from "@/features/pizza-art";
import { cn } from "@/lib/cn";
import type { CartLine } from "../types";

/** Small picture for a cart or order line: the pizza art, a photo, or the brand mark. */
export function LineThumb({
  line,
  className,
}: {
  line: Pick<CartLine, "art" | "image">;
  className?: string;
}) {
  if (line.art) return <PizzaImage art={line.art} px={160} className={cn("size-14 flex-none", className)} />;
  if (line.image)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, pre-optimised webp
      <img
        src={line.image}
        alt=""
        loading="lazy"
        className={cn("size-14 flex-none rounded-2xl object-cover", className)}
      />
    );
  return <span aria-hidden="true" className={cn("ember-fill size-14 flex-none rounded-2xl", className)} />;
}
