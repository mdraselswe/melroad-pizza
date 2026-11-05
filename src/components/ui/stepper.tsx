"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  decreaseLabel: string;
  increaseLabel: string;
  size?: "sm" | "md";
  className?: string;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  decreaseLabel,
  increaseLabel,
  size = "md",
  className,
}: StepperProps) {
  const btn = cn(
    "grid place-items-center rounded-full border border-line transition-colors hover:bg-faint disabled:opacity-35 disabled:hover:bg-transparent",
    size === "sm" ? "size-8" : "size-10",
  );
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <button
        type="button"
        className={btn}
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span
        className={cn("text-center font-semibold tabular-nums", size === "sm" ? "w-6 text-sm" : "w-8")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
