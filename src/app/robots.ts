import type { MetadataRoute } from "next";
import { tenant } from "@/config/tenant";
import { pageUrl, ROUTES } from "@/constants/routes";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [pageUrl(ROUTES.checkout), "/order/"] },
    sitemap: new URL("/sitemap.xml", tenant.seo.siteUrl).toString(),
  };
}
