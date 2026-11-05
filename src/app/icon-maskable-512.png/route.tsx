import { appIcon } from "@/features/pwa";

export const dynamic = "force-static";

/** Maskable icon for Android: full bleed, ring inside the safe zone. */
export function GET() {
  return appIcon({ size: 512, shape: "square", ring: 0.5 });
}
