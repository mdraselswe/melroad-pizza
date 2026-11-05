import type { ItemTag } from "@/config/menu-schema";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";

// Literal class strings so Tailwind can see them.
const ACCENT = "text-accent bg-[color-mix(in_oklab,var(--accent)_13%,transparent)]";
const GREEN = "text-success bg-[color-mix(in_oklab,var(--success)_13%,transparent)]";
const HOT = "text-danger bg-[color-mix(in_oklab,var(--danger)_13%,transparent)]";
const PLAIN = "bg-faint text-muted";

const TONES: Record<ItemTag, string> = {
  popular: ACCENT,
  new: ACCENT,
  vegetarian: GREEN,
  vegan: GREEN,
  spicy: HOT,
  halal: PLAIN,
  seafood: PLAIN,
};

export function Tag({ tag, className }: { tag: ItemTag; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold",
        TONES[tag],
        className,
      )}
    >
      {t(`tag.${tag}`)}
    </span>
  );
}
