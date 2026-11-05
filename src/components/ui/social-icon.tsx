import { Globe } from "lucide-react";
import type { SocialKind } from "@/config/schema";

/** Simple brand glyphs (lucide ships no brand icons). 24×24, currentColor. */
const PATHS: Record<Exclude<SocialKind, "website">, string> = {
  facebook:
    "M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5v3.6h2.8V22H14v-9.9h2.8l.4-3.6H14Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.1-9.5a1.2 1.2 0 1 0 0 2.3 1.2 1.2 0 0 0 0-2.3Z",
  tiktok:
    "M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.3 6.3 0 1 0 5.3 6.2V8.8a7.6 7.6 0 0 0 4.4 1.4V6.9a4.4 4.4 0 0 1-4.4-4.4Z",
  x: "M17.8 2.5h3.1l-6.8 7.7 8 10.6h-6.3l-4.9-6.4-5.6 6.4H2.2l7.2-8.3L1.8 2.5h6.4l4.4 5.9 5.2-5.9Zm-1.1 16.4h1.7L7.4 4.3H5.5l11.2 14.6Z",
  youtube:
    "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15V9l5.8 3-5.8 3Z",
};

export function SocialIcon({ kind, className }: { kind: SocialKind; className?: string }) {
  if (kind === "website") return <Globe className={className} aria-hidden="true" />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={PATHS[kind]} />
    </svg>
  );
}
