import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { menu } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";
import { t } from "@/i18n";
import { itemsIn } from "@/lib/menu";

/** Home page strip of non-pizza categories with photos. */
export function CategoryShowcase() {
  const categories = menu.categories.filter((c) => c.kind === "standard" && c.image && itemsIn(c.id).length);
  if (!categories.length) return null;

  return (
    <section className="relative py-24 max-md:py-[72px]">
      <div className="wrap">
        <Reveal>
          <SectionHeading kicker={t("showcase.kicker")} title={t("showcase.title")} sub={t("showcase.sub")}>
            <Link
              href={ROUTES.menu}
              className="group inline-flex w-fit items-center gap-1 text-sm font-semibold text-accent no-underline"
            >
              {t("showcase.cta")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </SectionHeading>
        </Reveal>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-3.5 p-0">
          {categories.map((c, i) => (
            <li key={c.id}>
              <Reveal delay={Math.min(i, 6) * 60}>
                <Link
                  href={`${ROUTES.menu}#cat-${c.id}` as const}
                  className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-5 text-white no-underline"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-[2] size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-[1] bg-[linear-gradient(180deg,transparent_35%,rgba(16,8,4,.82))]"
                  />
                  <span className="flex items-end justify-between gap-2">
                    <span className="grid">
                      <b className="text-[22px] leading-tight tracking-[-.02em]">{c.name}</b>
                      <small className="text-[13px] opacity-80">
                        {t("showcase.count", { count: itemsIn(c.id).length })}
                      </small>
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
