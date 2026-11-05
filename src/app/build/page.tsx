import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ROUTES } from "@/constants/routes";
import { BuildStudio } from "@/features/pizza-builder";
import { t } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(t("build.title"), t("build.sub"), ROUTES.build);

export default function BuildPage() {
  return (
    <PageShell kicker={t("build.kicker")} title={t("build.title")} sub={t("build.sub")}>
      {/* The ?pizza= param is read on the client, so the static page needs a Suspense boundary. */}
      <Suspense fallback={<BuildStudio />}>
        <BuildStudio fromSearchParams />
      </Suspense>
    </PageShell>
  );
}
