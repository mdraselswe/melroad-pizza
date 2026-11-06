import type { Route } from "next";

/**
 * Internal links. Paths have no trailing slash so `typedRoutes` can check them;
 * `trailingSlash: true` in next.config adds it to every rendered link.
 */
export const ROUTES = {
  home: "/",
  menu: "/menu",
  build: "/build",
  deals: "/deals",
  checkout: "/checkout",
  order: (id: string): Route => `/order?id=${encodeURIComponent(id)}`,
  rewards: "/rewards",
  visit: "/visit",
  credits: "/credits",
} as const satisfies Record<string, Route | ((id: string) => Route)>;

/** The exported URL of a route (`/menu` → `/menu/`), for sitemap, canonical and manifest URLs. */
export const pageUrl = (route: string) => (route.endsWith("/") ? route : `${route}/`);
