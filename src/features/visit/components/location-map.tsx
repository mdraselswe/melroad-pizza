"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { tenant } from "@/config/tenant";
import { useInView } from "@/hooks/use-in-view";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { mapEmbedUrl } from "@/lib/maps";

const src = mapEmbedUrl(tenant.contact);

/**
 * Map embed that only loads once scrolled near (Google Maps is heavy). A
 * skeleton holds the space until it has loaded, so nothing jumps; in dark
 * mode the tiles are tinted to match the theme.
 */
export function LocationMap({ className }: { className?: string }) {
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: "300px" });
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      ref={ref}
      className={cn(
        "glass relative isolate min-h-[320px] overflow-hidden rounded-[var(--radius-panel)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn("skeleton absolute inset-0 transition-opacity duration-500", loaded && "opacity-0")}
      />
      {near ? (
        <iframe
          title={t("visit.map", { name: tenant.brand.fullName })}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className={cn(
            "map-frame absolute inset-0 size-full border-0 transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
      <a
        href={tenant.contact.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="glass absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-ink no-underline shadow-sm"
      >
        {t("visit.mapOpen")}
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}
