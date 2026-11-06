import type { Route } from "next";
import type { MessageKey } from "@/i18n";
import { ROUTES } from "./routes";

export interface NavLink {
  href: Route;
  label: MessageKey;
  /** Only shown when the matching tenant feature is on. */
  feature?: "loyalty";
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: ROUTES.menu, label: "nav.menu" },
  { href: ROUTES.deals, label: "nav.deals" },
  { href: ROUTES.build, label: "nav.build" },
  { href: ROUTES.rewards, label: "nav.rewards", feature: "loyalty" },
  { href: ROUTES.visit, label: "nav.visit" },
];
