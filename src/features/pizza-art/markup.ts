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

const CHEESE_TONES = ["#f6d98c", "#f2cd73", "#f8e2a0", "#efc463"];

/** Blobs of melted mozzarella covering most of the sauce, out to the crust in places. */
const cheeseBlobs = (() => {
  const rand = seededRandom(99);
  const blobs: { x: number; y: number; r: number; fill: string }[] = [];
  for (let i = 0; i < 42; i++) {
    const a = rand() * Math.PI * 2;
    const d = 74 + Math.sqrt(rand()) * 68;
    blobs.push({
      x: Math.cos(a) * d,
      y: Math.sin(a) * d,
      r: 22 + rand() * 12,
      fill: CHEESE_TONES[Math.floor(rand() * CHEESE_TONES.length)]!,
    });
  }
  return blobs;
})();

const blobCircles = (scale: number, fill?: string) =>
  cheeseBlobs
    .map((b) => `<circle cx="${f1(b.x)}" cy="${f1(b.y)}" r="${f1(b.r * scale)}" fill="${fill ?? b.fill}"/>`)
    .join("");

export const CHEESE_MARKUP = `<circle r="128" fill="#f4d480"/>${blobCircles(1)}`;

/** Orange, oily rim where the cheese melts into the sauce. */
const MELT_MARKUP = `<g filter="url(#sauceTex)" opacity=".85"><circle r="136" fill="#dc8433"/>${blobCircles(1.14, "#dc8433")}</g>`;

/** A few spots where sauce shows through the cheese. */
const SAUCE_PEEK_MARKUP = (() => {
  const rand = seededRandom(57);
  let s = "";
  for (let i = 0; i < 9; i++) {
    const a = rand() * Math.PI * 2;
    const d = 30 + rand() * 100;
    s += `<ellipse cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" rx="${f1(4 + rand() * 7)}" ry="${f1(3 + rand() * 5)}" transform="rotate(${(rand() * 180).toFixed(0)})" fill="#c4462a"/>`;
  }
  return `<g filter="url(#soft2)" opacity=".5">${s}</g>`;
})();

export const HERBS_MARKUP = (() => {
  const r = seededRandom(7);
  return (
    specks(r, 80, 160, "#3c5a24", 0.5, 1.3, 0.8) +
    specks(r, 30, 160, "#5b4a1c", 0.4, 1, 0.7) +
    specks(r, 36, 160, "#fff7e0", 0.4, 1, 0.7)
  );
})();

/** Flour dusting on the rim. */
const FLOUR_MARKUP = (() => {
  const r = seededRandom(13);
  let s = "";
  for (let i = 0; i < 40; i++) {
    const a = r() * Math.PI * 2;
    const d = 180 + r() * 17;
    s += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(0.5 + r() * 1.3)}" fill="#fff8ea" opacity="${f1(0.25 + r() * 0.3)}"/>`;
  }
  return s;
})();

/** Soft top-left light over the finished pizza. */
export const LIGHT_MARKUP = `<circle r="200" fill="url(#gLight)"/>`;

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
    `<circle r="202" fill="#3a1606" opacity=".4" filter="url(#blur3)" transform="translate(3 5)"/>` +
    `<circle r="200" fill="url(#${gradient})" filter="url(#dough)"/>` +
    `<circle r="190" fill="none" stroke="url(#gRimLight)" stroke-width="14"/>` +
    `<circle r="191" fill="none" stroke="#fff" stroke-width="18" filter="url(#leopard)" opacity=".6"/>` +
    `<circle r="190" fill="none" stroke="#fff" stroke-width="20" filter="url(#char)" opacity=".9"/>` +
    FLOUR_MARKUP +
    `<circle r="${sauceR + 2}" fill="none" stroke="#4a1e08" stroke-width="7" opacity=".45" filter="url(#blur3)"/>` +
    sauceLayer +
    (cheese ? MELT_MARKUP + `<g filter="url(#mozz)">${CHEESE_MARKUP}</g>` + SAUCE_PEEK_MARKUP : "")
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
