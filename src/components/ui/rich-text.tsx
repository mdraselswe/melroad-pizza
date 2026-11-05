import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Renders copy where `[word]` marks the accent word, set in the serif italic
 * with the ember gradient: "Feed the whole [crew]."
 */
export function RichText({ text, accentClassName }: { text: string; accentClassName?: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") && part.endsWith("]") ? (
          <span key={i} className={cn("accent-word ember-text", accentClassName)}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain text with the accent markers removed (for metadata and aria labels). */
export const stripAccent = (text: string) => text.replace(/[[\]]/g, "");
