import { ArrowRight, Gift } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { content, tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";
import { sizeLabel } from "@/lib/labels";
import { money } from "@/lib/format";
import { artFor, heroPizza } from "@/lib/menu";
import { sizePrice } from "@/lib/pricing";
import { BlurHeadline } from "./blur-headline";
import { HeroStage } from "./hero-stage";
import { OpenBadge } from "./open-badge";

export function Hero() {
  const art = heroPizza ? artFor(heroPizza) : undefined;
  const largest = tenant.pizza.sizes.find((s) => s.id === "L") ?? tenant.pizza.sizes.at(-1)!;

  return (
    <section className="relative isolate overflow-hidden pt-[calc(env(safe-area-inset-top,0px)+120px)] pb-10 max-md:pt-[calc(env(safe-area-inset-top,0px)+100px)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[2]">
        <i className="absolute -top-[6%] -right-[8%] size-[820px] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]" />
        <i className="absolute top-[26%] right-[20%] size-[640px] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)]" />
        <i className="absolute -top-[24%] -left-[16%] size-[600px] rounded-full bg-[radial-gradient(closest-side,var(--glow-2),transparent)] opacity-50" />
      </div>
      <div
        aria-hidden="true"
        className="dots-bg pointer-events-none absolute inset-0 -z-[1] [mask-image:radial-gradient(ellipse_at_70%_40%,#000_20%,transparent_70%)]"
      />
      <div className="wrap grid items-center gap-8 max-md:gap-2 md:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <OpenBadge className="animate-[rise_.8s_.15s_var(--ease-out-soft)_both]" />
          <BlurHeadline
            text={content.heroHeadline}
            className="mt-[22px] text-[clamp(44px,6.4vw,84px)] leading-[.98] tracking-[-.045em]"
          />
          <p className="mt-[22px] mb-0 max-w-[46ch] animate-[rise_.9s_.7s_var(--ease-out-soft)_both] text-lg text-muted">
            {content.heroLede}
          </p>
          <div className="mt-[30px] flex animate-[rise_.9s_.85s_var(--ease-out-soft)_both] flex-wrap gap-3">
            <ButtonLink href={ROUTES.menu} size="lg" className="group">
              {t("hero.cta")}
              <ArrowRight
                className="size-[18px] transition-transform group-hover:translate-x-[3px]"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink href={ROUTES.build} variant="ghost" size="lg">
              {t("hero.cta2")}
            </ButtonLink>
          </div>
          {tenant.loyalty.enabled ? (
            <Link
              href={ROUTES.rewards}
              className="glass group mt-4 inline-flex w-fit animate-[rise_.9s_.95s_var(--ease-out-soft)_both] items-center gap-2.5 rounded-full py-2 pr-4 pl-2 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-faint"
            >
              <span className="grid size-8 place-items-center rounded-full bg-accent text-on-accent">
                <Gift className="size-4" aria-hidden="true" />
              </span>
              <span>
                <RichText text={t("hero.loyalty", { rate: tenant.loyalty.pointsPerDollar })} />
              </span>
              <ArrowRight
                className="size-4 text-accent transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ) : null}
          <dl className="mt-10 flex animate-[rise_.9s_1s_var(--ease-out-soft)_both] flex-wrap gap-7 max-sm:gap-5">
            {content.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-[13.5px] text-muted">{s.label}</dt>
                <dd className="m-0 text-[30px] font-bold tracking-[-.03em] tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {heroPizza && art ? (
          <HeroStage
            art={art}
            ringText={content.ringText}
            priceTag={{
              label: t("hero.tag", { size: sizeLabel(largest.id), name: heroPizza.name }),
              price: money(sizePrice(heroPizza, largest.id), true),
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
