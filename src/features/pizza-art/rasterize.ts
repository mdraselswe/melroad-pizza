import { hashString, seededRandom } from "@/lib/rng";
import { piecesFor } from "./layout";
import { baseMarkup, HERBS_MARKUP, piecesMarkup, type BaseId } from "./markup";
import { PAINT_DEFS, type SauceId } from "./paint-defs";
import { TOPPINGS } from "./toppings";

/**
 * The SVG filters that make the dough, sauce and cheese look real are
 * expensive. We paint them once into a PNG (in the browser, off the main
 * render path) and cache the object URL, so spinning, parallax and lists only
 * move bitmaps. Falls back to the SVG itself if canvas export is unavailable.
 */
const cache = new Map<string, Promise<string>>();

function svgDocument(viewBox: string, inner: string, px: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${px}" height="${px}"><defs>${PAINT_DEFS}</defs>${inner}</svg>`;
}

export function rasterize(key: string, viewBox: string, inner: string, px: number): Promise<string> {
  const hit = cache.get(key);
  if (hit) return hit;
  const svgUrl = URL.createObjectURL(new Blob([svgDocument(viewBox, inner, px)], { type: "image/svg+xml" }));
  const job = new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = px;
        canvas.getContext("2d")!.drawImage(img, 0, 0, px, px);
        canvas.toBlob((out) => {
          if (!out) return resolve(svgUrl);
          URL.revokeObjectURL(svgUrl);
          resolve(URL.createObjectURL(out));
        }, "image/png");
      } catch {
        resolve(svgUrl);
      }
    };
    img.onerror = () => resolve(svgUrl);
    img.src = svgUrl;
  });
  cache.set(key, job);
  return job;
}

export interface PizzaArtSpec {
  id: string;
  sauce: SauceId;
  cheese?: boolean;
  toppings: readonly string[];
}

/** A finished pizza (no board), e.g. for the hero, cards and the cart. */
export function pizzaImage(art: PizzaArtSpec, px: number): Promise<string> {
  const pieces = piecesFor({ halves: [{ side: "F", id: art.id, toppings: art.toppings }] });
  const inner =
    baseMarkup({ sauce: art.sauce, cheese: art.cheese }) + piecesMarkup(pieces) + `<g>${HERBS_MARKUP}</g>`;
  return rasterize(
    `pizza:${art.id}:${art.sauce}:${art.toppings.join(",")}:${px}`,
    "-212 -212 424 424",
    inner,
    px,
  );
}

/** The builder's dough + sauce + cheese layer; toppings are drawn live on top. */
export function baseImage(opts: { baseId: BaseId; sauce: SauceId; sauceRight?: SauceId; cheese?: boolean }) {
  const key = `base:${opts.baseId}:${opts.sauce}:${opts.sauceRight ?? ""}:${opts.cheese ?? true}`;
  return rasterize(key, "-255 -255 510 510", baseMarkup(opts), 1080);
}

/** One topping on its own, for floating hero garnish. */
export function spriteImage(toppingId: string): Promise<string> {
  const topping = TOPPINGS[toppingId];
  const art = topping?.kind === "piece" ? topping.draw(seededRandom(hashString(`${toppingId}hero`))) : "";
  return rasterize(`sprite:${toppingId}`, "-32 -32 64 64", `<g filter="url(#spriteShadow)">${art}</g>`, 220);
}

/** Run work when the browser is idle, without starving the first paint. */
export function whenIdle(fn: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}
