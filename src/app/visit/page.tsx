import { Bike, Clock, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { content, tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { HoursTable } from "@/features/visit";
import { t } from "@/i18n";
import { money } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(t("visit.title"), t("visit.sub"), ROUTES.visit);

const { contact, ordering } = tenant;
const { delivery } = ordering;

function Card({
  icon,
  title,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`glass grid content-start gap-4 rounded-[var(--radius-panel)] p-[24px] ${className ?? ""}`}
    >
      <h2 className="m-0 flex items-center gap-2.5 text-lg font-bold tracking-[-.02em]">
        <span className="grid size-9 place-items-center rounded-full bg-faint text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function VisitPage() {
  const { address } = contact;
  return (
    <PageShell kicker={t("visit.kicker")} title={t("visit.title")} sub={t("visit.sub")}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          icon={<Clock className="size-[18px]" aria-hidden="true" />}
          title={t("visit.hours")}
          className="lg:row-span-2"
        >
          <HoursTable />
        </Card>

        <Card icon={<MapPin className="size-[18px]" aria-hidden="true" />} title={t("visit.address")}>
          <address className="text-[17px] leading-relaxed not-italic">
            {address.street}
            <br />
            {address.suburb} {address.state} {address.postcode}
          </address>
          <ButtonLink
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            className="w-fit"
          >
            {t("visit.directions")}
          </ButtonLink>
        </Card>

        <Card icon={<Phone className="size-[18px]" aria-hidden="true" />} title={t("visit.phone")}>
          <a
            href={`tel:${contact.phoneE164}`}
            className="text-[26px] font-bold tracking-[-.03em] text-ink no-underline"
          >
            {contact.phone}
          </a>
          <ButtonLink href={`tel:${contact.phoneE164}`} variant="ghost" className="w-fit">
            {t("visit.call")}
          </ButtonLink>
        </Card>

        {delivery.enabled ? (
          <Card
            icon={<Bike className="size-[18px]" aria-hidden="true" />}
            title={t("visit.delivery")}
            className="md:col-span-2"
          >
            <p className="m-0 text-[16px] text-muted">
              {t("visit.deliveryBody", {
                postcodes: delivery.postcodes.join(", "),
                fee: money(delivery.fee),
                minimum: money(delivery.minimumOrder, true),
              })}
              {delivery.freeOver !== undefined
                ? ` ${t("visit.deliveryFree", { amount: money(delivery.freeOver, true) })}`
                : ""}
            </p>
          </Card>
        ) : null}
      </div>

      <section className="mt-16 grid max-w-[720px] gap-4">
        <span className="text-[13px] font-semibold tracking-[.14em] text-accent uppercase">
          {t("about.kicker")}
        </span>
        <h2 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.05] font-bold tracking-[-.04em]">
          <RichText text={content.aboutTitle} />
        </h2>
        <p className="m-0 text-[18px] leading-relaxed text-muted">{content.aboutBody}</p>
      </section>
    </PageShell>
  );
}
