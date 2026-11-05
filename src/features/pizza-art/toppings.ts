import { blob, f1, glint, specks, type Rand } from "./shapes";

/**
 * Topping artwork. Each topping draws one piece around (0,0) in roughly a
 * 40×40 box; the scatter step decides how many pieces land on a pizza and how
 * far apart (`gap`). Drizzles are drawn across the whole pizza instead.
 */
export interface PieceTopping {
  kind: "piece";
  count: number;
  gap: number;
  draw: (rand: Rand) => string;
}

export interface DrizzleTopping {
  kind: "drizzle";
  /** Dark outline, body, highlight. */
  colors: readonly [string, string, string];
}

export type Topping = PieceTopping | DrizzleTopping;

const piece = (count: number, gap: number, draw: (rand: Rand) => string): PieceTopping => ({
  kind: "piece",
  count,
  gap,
  draw,
});

export const TOPPINGS: Record<string, Topping> = {
  pepperoni: piece(15, 44, (r) => {
    const R = 19 + r() * 3;
    return `<circle r="${R + 4}" fill="url(#gGrease)"/><path d="${blob(r, R, 0.08, 12)}" fill="url(#gPep)"/><circle r="${f1(R * 0.74)}" fill="none" stroke="#e0593b" stroke-width="1.4" opacity=".45"/>${specks(r, 7, R - 6, "#f19a78", 1, 2.6, 0.5)}${specks(r, 5, R - 2, "#2a0703", 0.6, 1.4, 0.55)}${glint(-R * 0.28, -R * 0.32, R * 0.32, R * 0.16)}`;
  }),
  salami: piece(9, 40, (r) => {
    const R = 16 + r() * 3;
    return `<circle r="${R + 3}" fill="url(#gGrease)" opacity=".7"/><path d="${blob(r, R, 0.1, 11)}" fill="url(#gSal)"/>${specks(r, 10, R - 3, "#f4cdbd", 0.9, 2.4, 0.85)}${specks(r, 5, R - 3, "#1b0304", 0.7, 1.5, 0.6)}${glint(-R * 0.3, -R * 0.3, R * 0.3, R * 0.14, 0.16)}`;
  }),
  ham: piece(10, 34, (r) => {
    const d = blob(r, 14, 0.45, 7);
    return `<path d="${d}" fill="url(#gHam)"/><path d="${d}" fill="none" stroke="#fbd9d1" stroke-width="2.2" opacity=".75"/><path d="M-7 -2 Q0 -6 7 0" stroke="#f9d3ca" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }),
  bacon: piece(9, 34, (r) => {
    const w = 16 + r() * 4;
    const d = `M${f1(-w)} 0 q${f1(w / 3)} -7 ${f1((w * 2) / 3)} 0 t${f1((w * 2) / 3)} 0 t${f1((w * 2) / 3)} 0`;
    return `<path d="${d}" stroke="#5e170c" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#a5321e" stroke-width="10.5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#f6c3ae" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85" transform="translate(0 -1.5)"/>`;
  }),
  mushroom: piece(
    9,
    34,
    (r) =>
      `<g transform="scale(${f1(0.9 + r() * 0.2)})"><path d="M-17 3 C-18 -16 18 -16 17 3 Q0 6 -17 3Z" fill="url(#gMush)" stroke="#8d6741" stroke-width="1.8"/><path d="M-6 3 L-5 14 Q0 17 5 14 L6 3" fill="url(#gMush)" stroke="#8d6741" stroke-width="1.6"/><path d="M-12 0 Q-9 -6 -7 -9 M-5 1 L-3 -11 M2 1 L2 -11 M8 0 L7 -9 M13 0 Q11 -5 10 -7" stroke="#b08c66" stroke-width="1" stroke-linecap="round" opacity=".8"/><path d="M-14 -4 C-12 -12 -4 -14 2 -13" stroke="#fff" stroke-width="1.6" fill="none" opacity=".35" stroke-linecap="round"/></g>`,
  ),
  capsicum: piece(9, 30, (r) => {
    const w = 12 + r() * 5;
    const h = 14 + r() * 5;
    return `<path d="M${f1(-w)} 6 Q0 ${f1(-h)} ${f1(w)} 6" fill="none" stroke="#1a5222" stroke-width="7.5" stroke-linecap="round"/><path d="M${f1(-w)} 6 Q0 ${f1(-h)} ${f1(w)} 6" fill="none" stroke="url(#gCap)" stroke-width="5.5" stroke-linecap="round"/><path d="M${f1(-w + 3)} 3 Q0 ${f1(-h + 4)} ${f1(w - 4)} 3" fill="none" stroke="#a9e39a" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
  }),
  olive: piece(10, 22, (r) => {
    const R = 7 + r() * 1.2;
    return `<circle r="${f1(R)}" fill="none" stroke="url(#gOlive)" stroke-width="5.4"/><circle r="${f1(R - 2.6)}" fill="#b5392a" opacity=".55"/><path d="M${f1(-R * 0.7)} ${f1(-R * 0.5)} A${f1(R)} ${f1(R)} 0 0 1 ${f1(R * 0.4)} ${f1(-R * 0.9)}" stroke="#c8a8ba" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`;
  }),
  pineapple: piece(
    9,
    26,
    (r) =>
      `<path d="${blob(r, 10, 0.35, 4)}" fill="url(#gPine)" stroke="#c98d1b" stroke-width="1.4" stroke-linejoin="round"/><path d="M-5 -4 L4 5 M2 -6 L-4 3 M-7 1 L1 -7" stroke="#fff3c0" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>`,
  ),
  onion: piece(9, 26, (r) => {
    const w = 11 + r() * 5;
    return `<path d="M${f1(-w)} 5 Q0 -14 ${f1(w)} 5" fill="none" stroke="url(#gOnion)" stroke-width="3.8" stroke-linecap="round" opacity=".92"/><path d="M${f1(-w + 3)} 3 Q0 -9 ${f1(w - 3)} 3" fill="none" stroke="#f0d6e6" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`;
  }),
  chicken: piece(
    11,
    32,
    (r) =>
      `<path d="${blob(r, 12.5, 0.4, 7)}" fill="url(#gChick)"/><path d="M-7 -6 L-2 8 M2 -8 L7 5" stroke="#7a4a1e" stroke-width="2.4" stroke-linecap="round" opacity=".55"/><path d="M-8 -5 Q-2 -10 6 -8" stroke="#fff" stroke-width="1.4" fill="none" opacity=".3" stroke-linecap="round"/>`,
  ),
  jalapeno: piece(
    8,
    26,
    (r) =>
      `<circle r="9" fill="url(#gJal)"/>${specks(r, 5, 3.5, "#f9fbe6", 0.9, 1.5, 1)}<path d="M-6 -5 A8 8 0 0 1 3 -8" stroke="#c6f0a8" stroke-width="1.4" fill="none" opacity=".6"/>`,
  ),
  beef: piece(14, 22, (r) => {
    let s = "";
    for (let i = 0; i < 4; i++) {
      const a = r() * Math.PI * 2;
      const d = r() * 5;
      s += `<path d="${blob(r, 3 + r() * 2.2, 0.5, 6)}" transform="translate(${f1(Math.cos(a) * d)} ${f1(Math.sin(a) * d)})" fill="url(#gBeef)"/>`;
    }
    return s;
  }),
  tomato: piece(6, 50, (r) => {
    let s = "";
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + r() * 0.3;
      const cx = f1(Math.cos(a) * 9.5);
      const cy = f1(Math.sin(a) * 9.5);
      s += `<ellipse cx="${cx}" cy="${cy}" rx="4.6" ry="2.8" transform="rotate(${(a * 57.3).toFixed(0)} ${cx} ${cy})" fill="#fbb48f" opacity=".9"/>`;
    }
    return `<circle r="20" fill="url(#gTom)"/>${s}<circle r="3.5" fill="#f7a07e"/>${glint(-7, -8, 6, 2.6, 0.25, -35)}`;
  }),
  basil: piece(
    7,
    34,
    () =>
      `<path d="M-15 0 Q-5 -13 15 0 Q-5 13 -15 0Z" fill="url(#gBasil)"/><path d="M-13 0 L13 0 M-4 0 L1 -6 M3 0 L7 -5 M-4 0 L1 6 M3 0 L7 5" stroke="#8fd283" stroke-width="1" fill="none" opacity=".75"/>`,
  ),
  spinach: piece(9, 30, (r) => {
    const s = 0.85 + r() * 0.3;
    return `<g transform="scale(${f1(s)})"><path d="M-14 1 C-10 -12 8 -14 14 -2 C8 9 -8 10 -14 1Z" fill="url(#gSpinach)"/><path d="M-12 1 C-4 -2 4 -3 12 -2" stroke="#6fb26a" stroke-width="1" fill="none" opacity=".7"/></g>`;
  }),
  cheese: piece(
    16,
    20,
    (r) =>
      `<path d="${blob(r, 8 + r() * 4, 0.4, 7)}" fill="url(#gDollop)"/><ellipse cx="-2" cy="-3" rx="3" ry="1.6" fill="#fff" opacity=".7"/>`,
  ),
  bocconcini: piece(7, 42, (r) => {
    const R = 10 + r() * 2;
    return `<circle r="${f1(R)}" fill="url(#gBocc)"/><circle r="${f1(R)}" fill="none" stroke="#e4d6b2" stroke-width="1"/>${glint(-R * 0.3, -R * 0.35, R * 0.35, R * 0.18, 0.7)}`;
  }),
  feta: piece(12, 22, (r) => {
    const d = blob(r, 5.5 + r() * 2, 0.6, 5);
    return `<path d="${d}" fill="#fbf8ef"/><path d="${d}" fill="none" stroke="#e2d7bd" stroke-width="1"/>${specks(r, 3, 4, "#e9e0c8", 0.5, 1, 1)}`;
  }),
  egg: piece(
    3,
    80,
    (r) =>
      `<path d="${blob(r, 27, 0.28, 8)}" fill="#fffdf6"/><path d="${blob(r, 27, 0.1, 8)}" fill="none" stroke="#f0e2c0" stroke-width="2" opacity=".7"/><circle r="11" fill="url(#gYolk)"/>${glint(-4, -4.5, 4, 2, 0.75)}`,
  ),
  prawn: piece(8, 36, (r) => {
    const flip = r() > 0.5 ? -1 : 1;
    return `<g transform="scale(${flip} 1)"><path d="M10 -9 A12 12 0 1 0 8 10" fill="none" stroke="#a83c1e" stroke-width="9.5" stroke-linecap="round"/><path d="M10 -9 A12 12 0 1 0 8 10" fill="none" stroke="url(#gPrawn)" stroke-width="7.5" stroke-linecap="round"/><path d="M-2 -11 L-4 -5 M-10 -4 L-6 0 M-9 7 L-4 4 M0 11 L1 6" stroke="#ffd6bf" stroke-width="1.2" opacity=".75"/><path d="M8 10 L14 14 L10 7Z" fill="#c8482a"/></g>`;
  }),
  calamari: piece(9, 26, (r) => {
    const R = 7.5 + r() * 1.5;
    return `<circle r="${f1(R)}" fill="none" stroke="#b8803c" stroke-width="5.8"/><circle r="${f1(R)}" fill="none" stroke="#e9c27a" stroke-width="4.2"/>${specks(r, 6, R + 1, "#a46a2a", 0.5, 1, 0.8)}`;
  }),
  anchovy: piece(9, 30, (r) => {
    const w = 12 + r() * 3;
    return `<path d="M${f1(-w)} 0 Q0 -4.5 ${f1(w)} 0 Q0 4.5 ${f1(-w)} 0Z" fill="url(#gAnchovy)"/><path d="M${f1(-w + 2)} -0.5 L${f1(w - 2)} -0.5" stroke="#d9d4cb" stroke-width=".8" opacity=".7"/>`;
  }),
  sausage: piece(10, 30, (r) => {
    const R = 9 + r() * 1.5;
    return `<circle r="${f1(R)}" fill="url(#gSausage)"/><circle r="${f1(R - 1.5)}" fill="none" stroke="#e3a184" stroke-width=".8" opacity=".5"/>${specks(r, 6, R - 2, "#f2c3a8", 0.5, 1.1, 0.7)}${glint(-R * 0.3, -R * 0.3, R * 0.3, R * 0.14, 0.2)}`;
  }),
  kebab: piece(12, 28, (r) => {
    const d = blob(r, 9, 0.35, 7);
    const sx = f1(1.5 + r() * 0.3);
    return `<g transform="scale(${sx} .6)"><path d="${d}" fill="url(#gKebab)"/><path d="M-6 -3 L6 -3 M-7 2 L5 2" stroke="#3d1d0c" stroke-width="1.6" stroke-linecap="round" opacity=".55"/></g>`;
  }),
  chilli: piece(10, 22, (r) => {
    const R = 5 + r() * 1.5;
    return `<circle r="${f1(R)}" fill="none" stroke="#9b1408" stroke-width="3.6"/><circle r="${f1(R)}" fill="none" stroke="#e1301c" stroke-width="2.4"/>${specks(r, 3, R - 2, "#f7e6b0", 0.6, 1, 1)}`;
  }),
  bbq: { kind: "drizzle", colors: ["#3d1407", "#6b2a10", "#c47a4f"] },
  aioli: { kind: "drizzle", colors: ["#b9a77a", "#f4ead2", "#ffffff"] },
};

export const hasTopping = (id: string) => id in TOPPINGS;
