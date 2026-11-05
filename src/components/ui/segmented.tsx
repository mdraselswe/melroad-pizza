"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SegmentOption<T extends string> {
  id: T;
  label: ReactNode;
  hint?: ReactNode;
}

interface SegmentedProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Pill segmented control with a springy sliding thumb. Arrow keys move the selection. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedProps<T>) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.id === value),
  );
  const move = (delta: number) => onChange(options[(index + delta + options.length) % options.length]!.id);

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("relative grid rounded-2xl bg-faint p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-xl bg-bg shadow-[0_4px_14px_-6px_var(--shadow),0_0_0_1px_var(--glass-border)] transition-transform duration-[450ms] ease-[var(--ease-spring)]"
        style={{ width: `calc((100% - 8px) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative z-10 grid justify-items-center rounded-xl px-0.5 py-2 transition-colors",
              active ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            <b className="text-[14.5px] font-semibold">{o.label}</b>
            {o.hint ? <span className="text-[12.5px] tabular-nums">{o.hint}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
