import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { RichText } from "./rich-text";

interface SectionHeadingProps {
  kicker: string;
  title: string;
  sub?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  kicker,
  title,
  sub,
  as: Tag = "h2",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 grid max-w-[640px] gap-3", className)}>
      <span className="text-[13px] font-semibold tracking-[.14em] text-accent uppercase">{kicker}</span>
      <Tag
        className={cn(
          "m-0 font-bold tracking-[-.04em]",
          Tag === "h1"
            ? "text-[clamp(40px,5.6vw,72px)] leading-[1]"
            : "text-[clamp(34px,4.4vw,56px)] leading-[1.02]",
        )}
      >
        <RichText text={title} />
      </Tag>
      {sub ? <p className="m-0 text-[17px] text-muted">{sub}</p> : null}
      {children}
    </div>
  );
}
