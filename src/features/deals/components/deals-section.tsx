import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/effects/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { menu } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";
import { dealPizzaCount } from "@/lib/menu";
import { DealCard } from "./deal-card";

const BENTO_SIZE = 6;
const fit = (deal: Parameters<typeof dealPizzaCount>[0]) => Math.abs(dealPizzaCount(deal) - 5);

/** Home page bento: the first featured deal large, then the rest. */
export function DealsSection() {
  const featured = menu.deals.filter((d) => d.featured);
  const deals = [...featured, ...menu.deals.filter((d) => !d.featured)].slice(0, BENTO_SIZE);
  // The big card fans out five pizzas, so lead with the featured deal closest to five pizzas.
  const big = [...deals].filter((d) => d.featured).sort((a, b) => fit(a) - fit(b))[0] ?? deals[0];
  const ordered = big ? [big, ...deals.filter((d) => d !== big)] : deals;

  return (
    <section id="deals" className="relative py-24 max-md:py-[72px]">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={t("deals.kicker")} title={t("deals.title")} sub={t("deals.sub")} />
        </Reveal>
        <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-4 md:grid-cols-3">
          {ordered.map((deal, i) => (
            <Reveal
              key={deal.id}
              delay={(i % 3) * 80}
              className={i === 0 ? "md:col-span-2 md:row-span-2" : undefined}
            >
              <DealCard deal={deal} featured={i === 0} className="h-full w-full" />
            </Reveal>
          ))}
        </div>
        {menu.deals.length > BENTO_SIZE ? (
          <div className="mt-8 flex justify-center">
            <ButtonLink href={ROUTES.deals} variant="ghost" className="group">
              {t("deals.all")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
