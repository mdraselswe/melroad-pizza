import { Marquee } from "@/components/effects/marquee";
import { menu } from "@/config/tenant";
import { t } from "@/i18n";
import { money } from "@/lib/format";

export function DealsMarquee() {
  return (
    <Marquee label={t("deals.kicker")}>
      {menu.deals.slice(0, 8).map((deal) => (
        <span
          key={deal.id}
          className="inline-flex items-center gap-3 text-lg font-semibold tracking-[-.01em] whitespace-nowrap"
        >
          <i aria-hidden="true" className="ember-fill size-[7px] rounded-full" />
          {deal.description}
          <em className="font-serif text-[22px] font-normal text-accent">{money(deal.price, true)}</em>
        </span>
      ))}
    </Marquee>
  );
}
