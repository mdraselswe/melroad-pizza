import { SocialIcon } from "@/components/ui/social-icon";
import { tenant } from "@/config/tenant";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";

const { socials } = tenant.contact;

/** Round icon links to the shop's social pages. Renders nothing when none are set. */
export function SocialLinks({ className }: { className?: string }) {
  if (!socials.length) return null;
  return (
    <ul className={cn("m-0 flex list-none flex-wrap gap-2.5 p-0", className)}>
      {socials.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("social.label", { name: tenant.brand.fullName, network: s.label })}
            className="glass grid size-11 place-items-center rounded-full text-ink transition-[transform,color] hover:-translate-y-0.5 hover:text-accent"
          >
            <SocialIcon kind={s.kind} className="size-[19px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
