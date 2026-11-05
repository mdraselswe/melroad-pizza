import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "solid" | "quiet";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-shimmer",
  ghost: "glass text-ink hover:bg-faint",
  solid: "bg-ink text-bg hover:opacity-90",
  quiet: "text-muted hover:text-ink hover:bg-faint",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-7 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,color,opacity] select-none active:scale-[.98]",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}
