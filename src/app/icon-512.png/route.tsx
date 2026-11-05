import { appIcon } from "@/features/pwa";

export const dynamic = "force-static";

/** Standard app icon (512px), also the install splash. */
export function GET() {
  return appIcon({ size: 512, shape: "rounded", ring: 0.62 });
}
