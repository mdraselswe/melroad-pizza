import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { stripAccent } from "@/components/ui/rich-text";
import { CheckoutForm } from "@/features/checkout";
import { t } from "@/i18n";

export const metadata: Metadata = { title: stripAccent(t("checkout.title")), robots: { index: false } };

export default function CheckoutPage() {
  return (
    <PageShell kicker={t("cart.checkout")} title={t("checkout.title")}>
      <CheckoutForm />
    </PageShell>
  );
}
