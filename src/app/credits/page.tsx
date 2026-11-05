import { PageShell } from "@/components/layout/page-shell";
import { PHOTO_CREDITS, unsplashUrl } from "@/constants/credits";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(t("credits.title"), t("credits.sub"), ROUTES.credits);

export default function CreditsPage() {
  return (
    <PageShell kicker={t("footer.credits")} title={t("credits.title")} sub={t("credits.sub")}>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-3.5 p-0">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.file} className="glass overflow-hidden rounded-[var(--radius-card)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img
              src={`/images/menu/${c.file}`}
              alt={c.subject}
              loading="lazy"
              className="block aspect-[4/3] w-full object-cover"
            />
            <p className="m-0 grid gap-0.5 p-4 text-[14px]">
              <b>{c.subject}</b>
              <span className="text-muted">
                {t("credits.by")}{" "}
                <a href={unsplashUrl(c.id)} target="_blank" rel="noopener noreferrer" className="text-accent">
                  {c.author}
                </a>{" "}
                · Unsplash
              </span>
            </p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
