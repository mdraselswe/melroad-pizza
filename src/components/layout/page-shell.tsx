import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

interface PageShellProps {
  kicker: string;
  title: string;
  sub?: ReactNode;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Inner-page frame: clears the floating header and sets the page heading (h1). */
export function PageShell({ kicker, title, sub, aside, className, children }: PageShellProps) {
  return (
    <div className={cn("wrap relative pt-[clamp(120px,14vw,150px)] pb-24", className)}>
      <div
        aria-hidden="true"
        className="horizon pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[420px] opacity-60"
      />
      <SectionHeading as="h1" kicker={kicker} title={title} sub={sub}>
        {aside}
      </SectionHeading>
      {children}
    </div>
  );
}
