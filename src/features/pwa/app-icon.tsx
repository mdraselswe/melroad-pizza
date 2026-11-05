import { ImageResponse } from "next/og";
import { tenant } from "@/config/tenant";
import { appBackground } from "@/constants/theme";

export type AppIconShape = "rounded" | "square";

interface AppIconOptions {
  size: number;
  /** "rounded" for regular icons; "square" (full bleed) for maskable and Apple icons, which the OS crops. */
  shape: AppIconShape;
  /** Ring diameter as a share of the icon. Maskable icons keep it inside the 80% safe zone. */
  ring: number;
}

/**
 * The brand mark (ember ring) on a tile in the app's background colour, so the
 * installed icon, splash screen and dark theme all match. Rendered to PNG at build.
 */
export function appIcon({ size, shape, ring }: AppIconOptions) {
  const [a, b, c] = tenant.theme.gradient;
  const bg = appBackground(tenant.theme.defaultMode);
  const d = Math.round(size * ring);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 45%, ${a}40, ${bg} 62%)`,
        backgroundColor: bg,
        borderRadius: shape === "rounded" ? size * 0.22 : 0,
      }}
    >
      <div
        style={{
          width: d,
          height: d,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${c}, ${a} 45%, ${b})`,
          boxShadow: `0 0 ${Math.round(size * 0.09)}px ${a}99`,
        }}
      >
        <div style={{ width: d * 0.4, height: d * 0.4, borderRadius: "50%", backgroundColor: bg }} />
      </div>
    </div>,
    { width: size, height: size },
  );
}
