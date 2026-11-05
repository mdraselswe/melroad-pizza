import { seededRandom } from "@/lib/rng";
import type { DrizzlePiece, Piece, PlacedPiece } from "./layout";
import { f1, specks } from "./shapes";
import type { SauceId } from "./paint-defs";

/** SVG markup strings for the parts of a pizza. Everything is centred on (0,0); the pizza is r=200. */

export type BaseId = "classic" | "thin" | "gf" | (string & {});

const CRUST: Record<string, { gradient: string; sauceR: number }> = {
  classic: { gradient: "gCrust", sauceR: 172 },
  thin: { gradient: "gCrustThin", sauceR: 185 },
  gf: { gradient: "gCrustGF", sauceR: 175 },
};

const crustFor = (baseId: BaseId) => CRUST[baseId] ?? CRUST.classic!;

export const CHEESE_MARKUP = (() => {
  const rand = seededRandom(99);
  let s = `<circle r="118" fill="#f8e2a2"/>`;
  for (let i = 0; i < 34; i++) {
    const a = rand() * Math.PI * 2;
    const d = 70 + Math.sqrt(rand()) * 70;
    s += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(24 + rand() * 18)}" fill="${rand() > 0.3 ? "#f8e2a2" : "#f3d27e"}"/>`;
  }
  return s;
})();

export const HERBS_MARKUP = (() => {
  const r = seededRandom(7);
  return specks(r, 70, 160, "#3c5a24", 0.5, 1.3, 0.8) + specks(r, 40, 160, "#fff7e0", 0.4, 1, 0.75);
})();

export const BOARD_MARKUP =
  `<ellipse fill="rgba(0,0,0,.35)" cx="8" cy="24" rx="232" ry="226" filter="url(#blur14)"/>` +
  `<circle r="238" class="board-fill"/><circle r="238" filter="url(#wood)" fill="#fff"/>` +
  `<circle r="237" fill="none" class="board-edge" stroke-width="3"/>`;

interface BaseOptions {
  baseId?: BaseId;
  sauce?: SauceId;
  /** Different sauce on the right half. */
  sauceRight?: SauceId;
  cheese?: boolean;
}

export function baseMarkup({
  baseId = "classic",
  sauce = "tomato",
  sauceRight,
  cheese = true,
}: BaseOptions = {}) {
  const { gradient, sauceR } = crustFor(baseId);
  const sauceCircle = (id: SauceId, clip?: string) =>
    `<circle class="sauce" r="${sauceR}" fill="url(#gSauce-${id})" filter="url(#sauceTex)"${clip ? ` clip-path="url(#${clip})"` : ""}/>`;
  const sauceLayer =
    sauceRight && sauceRight !== sauce
      ? sauceCircle(sauce, "clipL") + sauceCircle(sauceRight, "clipR")
      : sauceCircle(sauce);
  return (
    `<circle r="202" fill="#3a1606" opacity=".35" filter="url(#blur3)" transform="translate(2 4)"/>` +
    `<circle r="200" fill="url(#${gradient})" filter="url(#dough)"/>` +
    `<circle r="192" fill="none" stroke="#fff" stroke-width="16" filter="url(#leopard)" opacity=".5"/>` +
    `<circle r="174" fill="none" stroke="#5a2a0c" stroke-width="6" opacity=".35" filter="url(#blur3)"/>` +
    sauceLayer +
    (cheese ? `<g filter="url(#mozz)">${CHEESE_MARKUP}</g>` : "")
  );
}

export function drizzleMarkup(p: Pick<DrizzlePiece, "path" | "colors" | "side">) {
  const [dark, body, light] = p.colors;
  const clip = p.side === "F" ? "" : ` clip-path="url(#clip${p.side})"`;
  return (
    `<g${clip}>` +
    `<path d="${p.path}" fill="none" stroke="${dark}" stroke-width="7" stroke-linecap="round" opacity=".9" filter="url(#shadow)"/>` +
    `<path d="${p.path}" fill="none" stroke="${body}" stroke-width="4.5" stroke-linecap="round"/>` +
    `<path d="${p.path}" fill="none" stroke="${light}" stroke-width="1.3" stroke-linecap="round" opacity=".7" transform="translate(-1 -1.5)"/>` +
    `</g>`
  );
}

export const pieceMarkup = (p: PlacedPiece) =>
  `<g transform="translate(${f1(p.x)} ${f1(p.y)})"><g transform="rotate(${p.rot.toFixed(0)})" filter="url(#shadow)">${p.art}</g></g>`;

export const piecesMarkup = (pieces: readonly Piece[]) =>
  pieces.map((p) => (p.kind === "drizzle" ? drizzleMarkup(p) : pieceMarkup(p))).join("");
