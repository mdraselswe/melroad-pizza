import { MapPin, Phone } from "lucide-react";
import { tenant } from "@/config/tenant";
import { cn } from "@/lib/cn";
import { addressLine } from "@/lib/maps";

const { contact } = tenant;

const LINK = "flex items-center gap-3 text-[16px] font-medium text-ink no-underline hover:text-accent";
const ICON = "grid size-9 shrink-0 place-items-center rounded-full bg-faint text-accent";

/** Address (opens maps) and phone (tap to call). */
export function ContactLines({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3", className)}>
      <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
        <span className={ICON}>
          <MapPin className="size-[17px]" aria-hidden="true" />
        </span>
        {addressLine(contact)}
      </a>
      <a href={`tel:${contact.phoneE164}`} className={cn(LINK, "tabular-nums")}>
        <span className={ICON}>
          <Phone className="size-[17px]" aria-hidden="true" />
        </span>
        {contact.phone}
      </a>
    </div>
  );
}
