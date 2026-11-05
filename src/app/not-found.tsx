import { ButtonLink } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[80svh] place-content-center justify-items-center gap-5 pt-28 pb-16 text-center">
      <span
        aria-hidden="true"
        className="ember-text text-[clamp(96px,18vw,200px)] leading-none font-bold tracking-[-.06em]"
      >
        404
      </span>
      <h1 className="m-0 text-[clamp(30px,4vw,48px)] leading-[1.05] font-bold tracking-[-.04em]">
        <RichText text={t("notFound.title")} />
      </h1>
      <p className="m-0 text-lg text-muted">{t("notFound.body")}</p>
      <ButtonLink href={ROUTES.home} size="lg">
        {t("notFound.cta")}
      </ButtonLink>
    </div>
  );
}
