/**
 * Throws a little pizza from `from` into the header cart button.
 * Pure DOM + WAAPI so it never re-renders React. Resolves when it lands.
 */
export function flyToCart(from: Element | null): Promise<void> {
  const to = document.getElementById("cart-button");
  if (!from || !to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const fly = document.createElement("div");
  fly.setAttribute("aria-hidden", "true");
  Object.assign(fly.style, {
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: "95",
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    pointerEvents: "none",
    background: "radial-gradient(circle, #c63b20 0 52%, #f7dc96 53% 61%, #d6913f 62% 100%)",
    boxShadow: "0 0 30px var(--ember-1)",
  });
  document.body.appendChild(fly);
  const sx = a.left + a.width / 2 - 32;
  const sy = a.top + a.height / 2 - 32;
  const ex = b.right - 32;
  const ey = b.top + b.height / 2 - 32;
  const animation = fly.animate(
    [
      { transform: `translate(${sx}px,${sy}px) scale(2.4)`, opacity: 0.95 },
      {
        transform: `translate(${(sx + ex) / 2}px,${Math.min(sy, ey) - 90}px) scale(1.1)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(${ex}px,${ey}px) scale(.25)`, opacity: 0.6 },
    ],
    { duration: 800, easing: "cubic-bezier(.5,0,.3,1)", fill: "both" },
  );
  return animation.finished.then(
    () => fly.remove(),
    () => fly.remove(),
  );
}
