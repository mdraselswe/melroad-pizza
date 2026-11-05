import { appIcon } from "@/features/pwa";

export const dynamic = "force-static";

/** Home-screen icon for iOS (iOS rounds the corners). */
export function GET() {
  return appIcon({ size: 180, shape: "square", ring: 0.56 });
}
