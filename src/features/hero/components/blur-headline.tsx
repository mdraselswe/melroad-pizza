import { cn } from "@/lib/cn";

/** Headline whose words blur in one after another. `[word]` gets the ember serif accent. */
export function BlurHeadline({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 className={cn("m-0 font-bold", className)}>
      {words.map((word, i) => {
        const accent = /^\[.*\]/.test(word);
        return (
          <span key={i}>
            <span
              className={cn("blur-word", accent && "accent-word ember-text")}
              style={{ animationDelay: `${(0.25 + i * 0.08).toFixed(2)}s` }}
            >
              {word.replace(/[[\]]/g, "")}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </h1>
  );
}
