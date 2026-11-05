import { PageShell } from "@/components/layout/page-shell";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { ItemSheet, MenuBrowser } from "@/features/menu";
import { t } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

const sub = t("menu.sub", { currency: tenant.locale.currency });

export const metadata = pageMetadata(t("menu.title"), sub, ROUTES.menu);

export default function MenuPage() {
  return (
    <PageShell kicker={t("menu.kicker")} title={t("menu.title")} sub={sub}>
      <MenuBrowser />
      <ItemSheet />
    </PageShell>
  );
}
