import type { NextConfig } from "next";

/**
 * Static export: the whole site is prerendered to `out/` and can be hosted on
 * any static host (Vercel, Netlify, Cloudflare Pages, S3...). Ordering runs in
 * the browser against a mock service, so no server is required for the demo.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Auto-memoises components and hooks, so code stays free of manual useMemo/useCallback.
  reactCompiler: true,
  // Links and router.push are checked against the real routes at type-check time.
  typedRoutes: true,
  poweredByHeader: false,
};

export default nextConfig;
