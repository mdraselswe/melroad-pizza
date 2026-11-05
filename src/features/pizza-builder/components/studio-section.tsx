import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";
import { heroPizza } from "@/lib/menu";
import { PizzaStudio } from "./pizza-studio";

/** Home page "Build it your way" section. */
export function StudioSection() {
  if (!heroPizza) return null;
  return (
    <section id="studio" className="relative py-24 max-md:py-[72px]">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={t("studio.kicker")} title={t("studio.title")} sub={t("studio.sub")}>
            <Link
              href={ROUTES.build}
              className="group inline-flex w-fit items-center gap-1 text-sm font-semibold text-accent no-underline"
            >
              {t("studio.open")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </SectionHeading>
        </Reveal>
        <PizzaStudio initialPizzaId={heroPizza.id} />
      </div>
    </section>
  );
}
