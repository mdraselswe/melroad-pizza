import Link from "next/link";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";

/** Ember ring logo + wordmark. Colours follow the tenant theme. */
export function BrandMark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href={ROUTES.home}
      onClick={onNavigate}
      className="flex items-center gap-[9px] text-lg font-extrabold tracking-[-.02em] text-ink no-underline"
    >
      <span
        aria-hidden="true"
        className="grid size-[30px] place-items-center rounded-full bg-[conic-gradient(from_200deg,var(--ember-3),var(--ember-1),var(--ember-2),var(--ember-3))] shadow-[0_0_18px_var(--glow)] after:size-3 after:rounded-full after:bg-bg after:content-['']"
      />
      <span>{tenant.brand.name}</span>
    </Link>
  );
}
