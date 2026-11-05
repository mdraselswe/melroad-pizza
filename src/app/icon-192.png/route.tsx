import { appIcon } from "@/features/pwa";

export const dynamic = "force-static";

/** Standard app icon (192px). */
export function GET() {
  return appIcon({ size: 192, shape: "rounded", ring: 0.62 });
}
