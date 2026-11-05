"use client";

import { useMemo, useRef, type CSSProperties } from "react";
import { EmberCanvas } from "@/components/effects/ember-canvas";
import { pizzaImage, spriteImage, useRaster, type PizzaArtSpec } from "@/features/pizza-art";
import { cn } from "@/lib/cn";
import { useParallax } from "../use-parallax";

/** Where the floating toppings sit around the pizza, and how far each drifts with the cursor. */
const SPOTS: { style: CSSProperties; depth: number }[] = [
  { style: { left: "-2%", top: "6%", width: "17%" }, depth: 26 },
  { style: { right: "4%", top: "-2%", width: "14%" }, depth: -22 },
  { style: { left: "-6%", bottom: "22%", width: "13%" }, depth: -30 },
  { style: { right: "-4%", top: "34%", width: "12%" }, depth: 34 },
  { style: { left: "30%", bottom: "-4%", width: "10%" }, depth: 18 },
];
const FALLBACK_GARNISH = ["basil", "tomato", "mushroom", "pepperoni", "olive"];
const NOT_GARNISH = new Set(["bbq", "aioli", "cheese", "egg"]);

function Sprite({
  topping,
  style,
  depth,
  reverse,
}: {
  topping: string;
  style: CSSProperties;
  depth: number;
  reverse: boolean;
}) {
  const url = useRaster(`sprite:${topping}`, () => spriteImage(topping), { idle: true });
  return (
    <div data-depth={depth} className="absolute z-[2] aspect-square will-change-transform" style={style}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- generated blob URL
        <img
          src={url}
          alt=""
          className={cn(
            "block size-full animate-[bob_6s_ease-in-out_infinite]",
            reverse && "[animation-direction:reverse] [animation-duration:7.5s]",
          )}
        />
      ) : null}
    </div>
  );
}

interface HeroStageProps {
  art: PizzaArtSpec;
  ringText: string;
  priceTag: { label: string; price: string };
}

/** The glowing oven-mouth stage: rotating pizza, ring copy, embers, floating toppings, price tag. */
export function HeroStage({ art, ringText, priceTag }: HeroStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pizzaUrl = useRaster(`hero:${art.id}`, () => pizzaImage(art, 1000));
  useParallax(stageRef);

  const garnish = useMemo(() => {
    const pool = [...new Set([...art.toppings.filter((id) => !NOT_GARNISH.has(id)), ...FALLBACK_GARNISH])];
    return SPOTS.map((spot, i) => ({ ...spot, topping: pool[i % pool.length]! }));
  }, [art.toppings]);

  return (
    <div
      ref={stageRef}
      className="relative aspect-square w-full max-w-[560px] justify-self-center max-md:max-w-[420px]"
      aria-hidden="true"
    >
      <div className="horizon" />
      <EmberCanvas className="absolute -inset-x-[10%] -top-[10%] z-0 h-[110%] w-[120%]" />
      <div data-depth={12} className="absolute inset-[8%] z-[1] will-change-transform">
        <div className="absolute -inset-[11%] animate-[spin_70s_linear_infinite_reverse] will-change-transform">
          <svg viewBox="-100 -100 200 200" className="size-full overflow-visible">
            <defs>
              <path id="ring-path" d="M0 -91 A91 91 0 1 1 -0.01 -91" />
            </defs>
            <circle r="99" fill="none" stroke="var(--ring)" strokeWidth=".6" />
            <circle
              r="84"
              fill="none"
              stroke="var(--accent)"
              strokeWidth=".6"
              strokeDasharray="1 3"
              opacity=".5"
            />
            <text className="fill-muted text-[6.4px] font-semibold tracking-[.3em]">
              <textPath href="#ring-path" textLength="568" lengthAdjust="spacing">
                {ringText}
              </textPath>
            </text>
          </svg>
        </div>
        <div
          className={cn(
            "absolute inset-0",
            pizzaUrl ? "animate-[pizza-in_1.3s_cubic-bezier(.2,.9,.25,1.1)_both]" : "opacity-0",
          )}
        >
          <div className="absolute inset-x-[4%] top-[16%] -bottom-[8%] rounded-full bg-[radial-gradient(closest-side,var(--shadow),transparent)]" />
          <div className="absolute inset-0 animate-[spin_90s_linear_infinite] will-change-transform">
            {pizzaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- generated blob URL
              <img src={pizzaUrl} alt="" className="block size-full" />
            ) : null}
          </div>
          <div className="pointer-events-none absolute inset-[1%] rounded-full bg-[radial-gradient(circle_at_32%_26%,rgb(255_255_255/.22),transparent_42%,transparent_70%,rgb(30_8_0/.3))]" />
        </div>
      </div>
      {garnish.map((g, i) => (
        <Sprite key={i} topping={g.topping} style={g.style} depth={g.depth} reverse={i % 2 === 0} />
      ))}
      <div className="absolute right-[2%] bottom-[14%] z-[3] animate-[rise_.9s_1.4s_var(--ease-out-soft)_both] rounded-[18px] border border-line bg-solid px-4 py-3 shadow-[0_18px_40px_-20px_var(--shadow)] max-sm:right-0 max-sm:bottom-[6%]">
        <small className="block text-[12.5px] text-muted">{priceTag.label}</small>
        <b className="text-[22px] tracking-[-.02em]">{priceTag.price}</b>
      </div>
    </div>
  );
}
