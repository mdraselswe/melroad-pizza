import { PageShell } from "@/components/layout/page-shell";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { RewardsView } from "@/features/rewards";
import { t } from "@/i18n";
import { money } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

const { loyalty } = tenant;
const sub = loyalty.enabled
  ? t("rewards.sub", {
      rate: loyalty.pointsPerDollar,
      threshold: loyalty.rewardThreshold,
      value: money(loyalty.rewardValue, true),
    })
  : undefined;

export const metadata = pageMetadata(t("rewards.title"), sub ?? t("rewards.disabled"), ROUTES.rewards);

export default function RewardsPage() {
  return (
    <PageShell kicker={t("rewards.kicker")} title={t("rewards.title")} sub={sub}>
      <RewardsView />
    </PageShell>
  );
}
