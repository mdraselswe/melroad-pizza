/** Small SVG-string helpers shared by the topping artwork. Pure and deterministic given `rand`. */

export type Rand = () => number;

export const f1 = (n: number) => n.toFixed(1);

/** Scatter `n` dots inside a circle of radius `maxR`. */
export function specks(
  rand: Rand,
  n: number,
  maxR: number,
  color: string,
  rMin: number,
  rMax: number,
  opacity: number,
) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * maxR;
    out += `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(rMin + rand() * (rMax - rMin))}" fill="${color}" opacity="${opacity}"/>`;
  }
  return out;
}

/** A smooth, slightly irregular closed shape around the origin. `jitter` 0 = circle. */
export function blob(rand: Rand, r: number, jitter: number, points = 9) {
  const p: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (1 - jitter / 2 + rand() * jitter);
    p.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }
  let d = "";
  for (let i = 0; i <= points; i++) {
    const [x0, y0] = p[i % points]!;
    const [x1, y1] = p[(i + 1) % points]!;
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += i === 0 ? `M${f1(mx)} ${f1(my)}` : ` Q${f1(x0)} ${f1(y0)} ${f1(mx)} ${f1(my)}`;
  }
  return `${d}Z`;
}

/** Highlight glint used on glossy toppings. */
export const glint = (x: number, y: number, rx: number, ry: number, opacity = 0.22, rotate = -30) =>
  `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${rotate})" fill="#fff" opacity="${opacity}"/>`;
