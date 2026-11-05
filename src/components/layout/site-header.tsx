"use client";

import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tenant } from "@/config/tenant";
import { NAV_LINKS } from "@/constants/nav";
import { CartButton } from "@/features/cart";
import { t } from "@/i18n";
import { cn } from "@/lib/cn";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

const links = NAV_LINKS.filter((l) => !l.feature || tenant[l.feature].enabled);
const isActive = (pathname: string, href: string) =>
  pathname === href || pathname === href.replace(/\/$/, "");

/** Floating glass navigation pill. On small screens the links fold into a dropdown panel. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-[calc(env(safe-area-inset-top,0px)+14px)] left-1/2 z-50 w-[min(1180px,calc(100%-24px))] -translate-x-1/2 animate-[rise_.8s_var(--ease-out-soft)_both]">
      <nav
        aria-label={t("nav.label")}
        className="glass flex items-center gap-2.5 rounded-full py-2 pr-2 pl-4 shadow-[0_10px_40px_-20px_var(--shadow)]"
      >
        <BrandMark onNavigate={() => setOpen(false)} />
        <ul className="m-0 ml-4 hidden list-none gap-0.5 p-0 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted no-underline transition-colors hover:bg-faint hover:text-ink aria-[current=page]:bg-faint aria-[current=page]:text-ink"
              >
                {t(link.label)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <CartButton />
          <button
            type="button"
            className="grid size-[38px] place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t(open ? "nav.close" : "nav.open")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="size-[18px]" aria-hidden="true" />
            ) : (
              <MenuIcon className="size-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
      <div
        id="mobile-nav"
        hidden={!open}
        className="glass mt-2 rounded-[var(--radius-panel)] p-2 shadow-[0_30px_60px_-30px_var(--shadow)] lg:hidden"
      >
        <ul className="m-0 grid list-none gap-0.5 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-lg font-semibold tracking-[-.02em] no-underline transition-colors hover:bg-faint",
                  isActive(pathname, link.href) ? "text-ink" : "text-muted",
                )}
              >
                {t(link.label)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
