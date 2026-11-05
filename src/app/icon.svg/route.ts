import { tenant } from "@/config/tenant";
import { appBackground } from "@/constants/theme";

export const dynamic = "force-static";

/** Favicon in the tenant's ember gradient (mirrors the header brand mark). */
export function GET() {
  const [a, b, c] = tenant.theme.gradient;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
<circle cx="32" cy="32" r="30" fill="url(#g)"/><circle cx="32" cy="32" r="12" fill="${appBackground(tenant.theme.defaultMode)}"/>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
