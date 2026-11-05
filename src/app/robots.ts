import type { MetadataRoute } from "next";
import { tenant } from "@/config/tenant";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [ROUTES.checkout, "/order/"] },
    sitemap: new URL("/sitemap.xml", tenant.seo.siteUrl).toString(),
  };
}
