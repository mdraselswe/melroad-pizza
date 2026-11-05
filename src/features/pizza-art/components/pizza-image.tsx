"use client";

import { cn } from "@/lib/cn";
import { pizzaImage, type PizzaArtSpec } from "../rasterize";
import { useRaster } from "../use-raster";

interface PizzaImageProps {
  art: PizzaArtSpec;
  /** Rendered pixel size of the bitmap (not the CSS size). */
  px?: number;
  idle?: boolean;
  className?: string;
  alt?: string;
}

/** A finished pizza illustration that fades in once painted. */
export function PizzaImage({ art, px = 480, idle = true, className, alt = "" }: PizzaImageProps) {
  const key = `${art.id}:${art.sauce}:${art.toppings.join(",")}:${px}`;
  const url = useRaster(key, () => pizzaImage(art, px), { idle });
  return (
    <span className={cn("relative block aspect-square", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-[3%] rounded-full bg-[radial-gradient(circle,#e9b46f_0_58%,#d6913f_70%,#a8611f_100%)] opacity-30 transition-opacity duration-500",
          url && "opacity-0",
        )}
      />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- generated blob URL
        <img
          src={url}
          alt={alt}
          decoding="async"
          draggable={false}
          className="block size-full animate-[rise_.6s_ease-out_both]"
        />
      ) : null}
    </span>
  );
}
