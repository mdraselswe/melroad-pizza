import { t } from "@/i18n";

/**
 * Shown only if a page isn't ready the moment a link is clicked (static pages
 * are normally prefetched). Mirrors the PageShell heading and a card grid so
 * the real content replaces it without a jump.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label={t("loading.label")}
      className="wrap animate-[fade-in_.3s_.15s_both] pt-[clamp(120px,14vw,150px)] pb-24"
    >
      <div className="mb-10 grid max-w-[640px] gap-4">
        <span className="skeleton h-3.5 w-24 rounded-full" />
        <span className="skeleton h-[clamp(40px,5.6vw,72px)] w-[min(520px,90%)] rounded-2xl" />
        <span className="skeleton h-4 w-[min(420px,80%)] rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="glass grid gap-4 rounded-[var(--radius-card)] p-5">
            <span className="skeleton aspect-[4/3] rounded-2xl" />
            <span className="skeleton h-5 w-2/3 rounded-full" />
            <span className="skeleton h-3.5 w-full rounded-full" />
            <span className="skeleton h-3.5 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
