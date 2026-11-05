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
  poweredByHeader: false,
};

export default nextConfig;
