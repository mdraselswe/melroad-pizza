import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { content, tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";
import { ContactLines } from "./contact-lines";
import { HoursTable } from "./hours-table";
import { LocationMap } from "./location-map";
import { SocialLinks } from "./social-links";

/** Home page "about + find us" block: story, hours, contact, socials and a map. */
export function VisitSection() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 max-md:py-[72px]">
      <div className="wrap grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal className="grid content-start gap-7">
          <SectionHeading
            kicker={t("visit.kickerHome")}
            title={content.aboutTitle}
            sub={content.aboutBody}
            className="mb-0"
          />
          <ContactLines />
          <div className="glass rounded-[var(--radius-panel)] p-5">
            <HoursTable />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={`${ROUTES.visit}#contact`} className="group">
              {t("visit.contactCta")}
              <ArrowRight
                className="size-[17px] transition-transform group-hover:translate-x-[3px]"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink
              href={tenant.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
            >
              {t("visit.directions")}
            </ButtonLink>
            <SocialLinks />
          </div>
        </Reveal>
        <Reveal delay={120} className="min-h-[360px]">
          <LocationMap className="h-full min-h-[360px] lg:min-h-[560px]" />
        </Reveal>
      </div>
    </section>
  );
}
