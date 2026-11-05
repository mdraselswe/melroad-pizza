"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  max: number;
  phase: number;
  sprite: number;
  flicker: number;
}

const COUNT = 46;
const HUES = [24, 36, 46];

/** Pre-render each glow once; per frame we only blit bitmaps (cheap on mobile). */
function makeSprites(): HTMLCanvasElement[] {
  return HUES.map((hue) => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, `hsla(${hue},100%,88%,1)`);
    grad.addColorStop(0.22, `hsla(${hue},100%,62%,.95)`);
    grad.addColorStop(1, `hsla(${hue},100%,50%,0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return c;
  });
}

/** Rising embers behind the hero pizza. Pauses off-screen and respects reduced motion. */
export function EmberCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let running = true;
    let raf = 0;
    let frame = 0;
    let blend: GlobalCompositeOperation = "lighter";
    const sprites = makeSprites();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (): Particle => ({
      x: w * (0.15 + Math.random() * 0.7),
      y: h * (0.7 + Math.random() * 0.3),
      r: 0.8 + Math.random() * 2.2,
      vy: 0.25 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.3,
      life: 0,
      max: 200 + Math.random() * 260,
      phase: Math.random() * 60,
      sprite: Math.floor(Math.random() * sprites.length),
      flicker: 0.7 + Math.random() * 0.3,
    });

    resize();
    const particles = Array.from({ length: COUNT }, () => {
      const p = spawn();
      p.life = Math.random() * p.max;
      p.y -= p.life * p.vy;
      return p;
    });

    const tick = () => {
      if (!running) return;
      if (frame++ % 60 === 0) {
        blend = getComputedStyle(document.documentElement).colorScheme.includes("dark")
          ? "lighter"
          : "source-over";
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = blend;
      for (const p of particles) {
        p.life++;
        p.y -= p.vy;
        p.x += p.vx + Math.sin((p.life + p.phase) / 30) * 0.25;
        const k = p.life / p.max;
        const size = p.r * 7;
        ctx.globalAlpha = Math.max(0, Math.sin(Math.PI * k) * p.flicker * (0.8 + 0.2 * Math.sin(p.life / 4)));
        ctx.drawImage(sprites[p.sprite]!, p.x - size / 2, p.y - size / 2, size, size);
        if (p.life >= p.max) Object.assign(p, spawn());
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      const visible = !!entry?.isIntersecting && !document.hidden;
      if (visible && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)} />;
}
