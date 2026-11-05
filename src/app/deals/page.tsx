import { PageShell } from "@/components/layout/page-shell";
import { menu } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { DealCard, DealSheet } from "@/features/deals";
import { t } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(t("deals.page.title"), t("deals.page.sub"), ROUTES.deals);

export default function DealsPage() {
  const deals = [...menu.deals.filter((d) => d.featured), ...menu.deals.filter((d) => !d.featured)];
  return (
    <PageShell kicker={t("deals.kicker")} title={t("deals.page.title")} sub={t("deals.page.sub")}>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3.5 p-0">
        {deals.map((deal) => (
          <li key={deal.id} className="flex">
            <DealCard deal={deal} className="min-h-[260px] w-full" />
          </li>
        ))}
      </ul>
      <DealSheet />
    </PageShell>
  );
}
