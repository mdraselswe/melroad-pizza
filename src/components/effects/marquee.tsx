import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Infinite horizontal ticker. Children are rendered twice; the second copy is hidden from assistive tech. */
export function Marquee({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("marquee-mask overflow-hidden border-y border-line py-[18px]", className)}
      aria-label={label}
      role="region"
    >
      <div className="marquee-track flex w-max">
        <div className="flex gap-12 pr-12">{children}</div>
        <div className="flex gap-12 pr-12" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
