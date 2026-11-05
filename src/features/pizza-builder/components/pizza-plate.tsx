"use client";

import { AnimatePresence, motion, MotionConfig, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import {
  BOARD_MARKUP,
  HERBS_MARKUP,
  baseImage,
  useRaster,
  type DrizzlePiece,
  type Piece,
  type PlacedPiece,
  type SauceId,
} from "@/features/pizza-art";
import { dropDelays } from "../builder-state";

const SPRING_DROP = [0.25, 1.3, 0.45, 1] as const;
const EASE_IN = [0.5, 0, 0.75, 0] as const;

function ToppingPiece({ piece, delay }: { piece: PlacedPiece; delay: number }) {
  const sway = (piece.x > 0 ? -1 : 1) * 18;
  return (
    <g transform={`translate(${piece.x.toFixed(1)} ${piece.y.toFixed(1)})`}>
      <motion.g
        initial={{ x: sway, y: -260, scale: 1.35, opacity: 0 }}
        animate={{
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          transition: {
            delay: delay / 1000,
            duration: 0.56,
            ease: SPRING_DROP,
            opacity: { delay: delay / 1000, duration: 0.2 },
          },
        }}
        exit={{ scale: 0, opacity: 0, transition: { duration: 0.26, ease: EASE_IN } }}
      >
        <g
          transform={`rotate(${piece.rot.toFixed(0)})`}
          filter="url(#shadow)"
          dangerouslySetInnerHTML={{ __html: piece.art }}
        />
      </motion.g>
    </g>
  );
}

function Drizzle({ piece, delay }: { piece: DrizzlePiece; delay: number }) {
  const [dark, body, light] = piece.colors;
  const draw = {
    pathLength: 1,
    transition: { delay: delay / 1000, duration: 1.1, ease: [0.45, 0, 0.2, 1] as const },
  };
  return (
    <motion.g
      clipPath={piece.side === "F" ? undefined : `url(#clip${piece.side})`}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.path
        d={piece.path}
        fill="none"
        stroke={dark}
        strokeWidth={7}
        strokeLinecap="round"
        opacity={0.9}
        filter="url(#shadow)"
        initial={{ pathLength: 0 }}
        animate={draw}
      />
      <motion.path
        d={piece.path}
        fill="none"
        stroke={body}
        strokeWidth={4.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={draw}
      />
      <motion.path
        d={piece.path}
        fill="none"
        stroke={light}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.7}
        transform="translate(-1 -1.5)"
        initial={{ pathLength: 0 }}
        animate={draw}
      />
    </motion.g>
  );
}

interface PizzaPlateProps {
  pieces: readonly Piece[];
  baseId: string;
  sauce: SauceId;
  sauceRight?: SauceId;
  cheese?: boolean;
  scale: number;
  half: boolean;
  rebuild: number;
  labelledBy: string;
}

/**
 * The pizza on its board. Dough/sauce/cheese is a cached bitmap; toppings are
 * live SVG so each one can drop in, and exit, on its own.
 */
export function PizzaPlate({
  pieces,
  baseId,
  sauce,
  sauceRight,
  cheese = true,
  scale,
  half,
  rebuild,
  labelledBy,
}: PizzaPlateProps) {
  const baseKey = `${baseId}:${sauce}:${sauceRight ?? ""}:${cheese}`;
  const baseUrl = useRaster(baseKey, () => baseImage({ baseId, sauce, sauceRight, cheese }));
  const [lastBase, setLastBase] = useState<string | null>(null);
  if (baseUrl && baseUrl !== lastBase) setLastBase(baseUrl);
  const shownBase = baseUrl ?? lastBase;

  // Delays are computed once per change of pieces, from the pieces that were already there.
  const [tracked, setTracked] = useState<{
    pieces: readonly Piece[];
    rebuild: number;
    delays: Map<string, number>;
  }>(() => ({
    pieces,
    rebuild,
    delays: dropDelays(new Set(), pieces, true),
  }));
  if (tracked.pieces !== pieces) {
    const previous = new Set(tracked.pieces.map((p) => p.key));
    setTracked({ pieces, rebuild, delays: dropDelays(previous, pieces, rebuild !== tracked.rebuild) });
  }

  const [spinRef, animate] = useAnimate<HTMLDivElement>();
  useEffect(() => {
    if (rebuild === 0) return;
    void animate(spinRef.current, { rotate: [0, -24, 0] }, { duration: 0.9, ease: [0.3, 1.2, 0.4, 1] });
  }, [rebuild, animate, spinRef]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative aspect-square w-[min(540px,100%)]">
        <svg
          viewBox="-255 -255 510 510"
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: BOARD_MARKUP }}
        />
        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.3,1.35,.45,1)] will-change-transform"
          style={{ transform: `scale(${scale})` }}
        >
          <div ref={spinRef} className="absolute inset-0">
            {shownBase ? (
              // eslint-disable-next-line @next/next/no-img-element -- generated blob URL
              <img src={shownBase} alt="" decoding="async" className="absolute inset-0 block size-full" />
            ) : (
              <span className="absolute inset-[10.8%] animate-pulse rounded-full bg-[radial-gradient(circle,#f3d98f_0_55%,#d9a35a_68%,#a8611f_100%)] opacity-60" />
            )}
            <svg
              viewBox="-255 -255 510 510"
              role="img"
              aria-labelledby={labelledBy}
              className="absolute inset-0 size-full overflow-visible"
            >
              <g className="steam" transform="translate(0,-160)">
                <path d="M-60 0 q-14 -20 0 -40 t0 -40" />
                <path d="M0 -10 q-14 -20 0 -40 t0 -40" />
                <path d="M60 0 q-14 -20 0 -40 t0 -40" />
              </g>
              <g>
                <AnimatePresence>
                  {pieces.map((p) =>
                    p.kind === "drizzle" ? (
                      <Drizzle key={p.key} piece={p} delay={tracked.delays.get(p.key) ?? 0} />
                    ) : (
                      <ToppingPiece key={p.key} piece={p} delay={tracked.delays.get(p.key) ?? 0} />
                    ),
                  )}
                </AnimatePresence>
              </g>
              <line
                x1="0"
                y1="-198"
                x2="0"
                y2="198"
                stroke="#4a1a06"
                strokeWidth="2.5"
                opacity={half ? 0.55 : 0}
                className="transition-opacity duration-500"
              />
              <g dangerouslySetInnerHTML={{ __html: HERBS_MARKUP }} />
              <circle r="202" fill="url(#gLight)" pointerEvents="none" />
            </svg>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
