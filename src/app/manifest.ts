import type { MetadataRoute } from "next";
import { tenant } from "@/config/tenant";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: tenant.brand.fullName,
    short_name: tenant.brand.name,
    description: tenant.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: tenant.theme.gradient[0],
    theme_color: tenant.theme.accentLight,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
