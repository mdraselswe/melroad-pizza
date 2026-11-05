"use client";

import { useOpenStatus } from "@/hooks/use-open-status";
import { cn } from "@/lib/cn";

/** "Open now · closes 1:30am" pill with a live ping dot. */
export function OpenBadge({ className }: { className?: string }) {
  const { status, label } = useOpenStatus();
  return (
    <span
      className={cn(
        "glass sheen inline-flex min-h-[34px] items-center gap-2.5 rounded-full py-1.5 pr-3.5 pl-2 text-[13.5px] font-medium",
        className,
      )}
    >
      <span className="ping-dot" data-open={String(!!status?.open)} />
      <span
        className={cn("transition-opacity duration-300", label ? "opacity-100" : "opacity-0")}
        suppressHydrationWarning
      >
        {label ?? " "}
      </span>
    </span>
  );
}
