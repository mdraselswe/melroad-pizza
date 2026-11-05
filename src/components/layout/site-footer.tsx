import Link from "next/link";
import { tenant } from "@/config/tenant";
import { NAV_LINKS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";
import { InstallLink } from "@/features/pwa";
import { SocialLinks } from "@/features/visit";
import { t } from "@/i18n";
import { groupHours } from "@/lib/hours";
import { addressLine } from "@/lib/maps";
import { BrandMark } from "./brand-mark";

const { contact, brand } = tenant;
const address = addressLine(contact);

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line pt-14 pb-[calc(40px+env(safe-area-inset-bottom,0px))] text-[15px] text-muted">
      <div className="wrap grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-3">
          <BrandMark />
          <p className="m-0 max-w-[36ch]">{brand.description}</p>
          <SocialLinks className="mt-1" />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="m-0 mb-1 text-[13px] font-semibold tracking-[.14em] text-ink uppercase">
            {t("footer.order")}
          </h2>
          {NAV_LINKS.filter((l) => !l.feature || tenant[l.feature].enabled).map((l) => (
            <Link key={l.href} href={l.href} className="w-fit text-muted no-underline hover:text-ink">
              {t(l.label)}
            </Link>
          ))}
        </div>
        <div className="grid content-start gap-2">
          <h2 className="m-0 mb-1 text-[13px] font-semibold tracking-[.14em] text-ink uppercase">
            {t("footer.visit")}
          </h2>
          <a
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-muted no-underline hover:text-ink"
          >
            {address}
          </a>
          <a href={`tel:${contact.phoneE164}`} className="w-fit text-muted no-underline hover:text-ink">
            {contact.phone}
          </a>
        </div>
        <div className="grid content-start gap-2">
          <h2 className="m-0 mb-1 text-[13px] font-semibold tracking-[.14em] text-ink uppercase">
            {t("footer.hours")}
          </h2>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {groupHours(tenant.hours, t("status.closed")).map((row) => (
              <div key={row.days} className="contents">
                <dt className="font-medium text-ink">{row.days}</dt>
                <dd className="m-0 tabular-nums">{row.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="wrap mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[13.5px]">
        <span>
          © {new Date().getFullYear()} {brand.fullName}
        </span>
        {tenant.demo.enabled ? <span>{t("footer.demo", { name: brand.fullName })}</span> : null}
        <span className="flex flex-wrap items-center gap-5">
          {tenant.pwa.enabled ? (
            <InstallLink className="cursor-pointer text-muted underline-offset-4 hover:text-ink hover:underline" />
          ) : null}
          <Link
            href={ROUTES.credits}
            className="text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {t("footer.credits")}
          </Link>
        </span>
      </div>
    </footer>
  );
}
