import type { MetadataRoute } from "next";
import { tenant } from "@/config/tenant";
import { pageUrl, ROUTES } from "@/constants/routes";
import { appBackground } from "@/constants/theme";
import { t } from "@/i18n";

export const dynamic = "force-static";

/** Installed-app identity: name, icons and colours all come from the tenant, matching the default theme. */
export default function manifest(): MetadataRoute.Manifest {
  const bg = appBackground(tenant.theme.defaultMode);
  const icon192 = { src: "/icon-192.png", sizes: "192x192", type: "image/png" };
  return {
    id: "/",
    name: tenant.brand.fullName,
    short_name: tenant.brand.name,
    description: tenant.seo.description,
    lang: tenant.locale.default,
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: bg,
    theme_color: bg,
    categories: ["food", "shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { ...icon192, purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: t("nav.menu"), url: pageUrl(ROUTES.menu), icons: [icon192] },
      { name: t("nav.build"), url: pageUrl(ROUTES.build), icons: [icon192] },
      { name: t("nav.deals"), url: pageUrl(ROUTES.deals), icons: [icon192] },
    ],
  };
}
