import type { MetadataRoute } from "next";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-static";

const PAGES = [
  ROUTES.home,
  ROUTES.menu,
  ROUTES.deals,
  ROUTES.build,
  ...(tenant.loyalty.enabled ? [ROUTES.rewards] : []),
  ROUTES.visit,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: new URL(path, tenant.seo.siteUrl).toString(),
    changeFrequency: "weekly",
    priority: path === ROUTES.home ? 1 : 0.7,
  }));
}
