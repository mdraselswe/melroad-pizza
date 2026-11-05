import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/layout/theme-script";
import { THEME_BG, themeAttr, type ThemeMode } from "@/constants/theme";
import { tenant } from "@/config/tenant";
import { CartDrawer, CartHydrator, Toaster } from "@/features/cart";
import { PaintDefs } from "@/features/pizza-art";
import { InstallCard, OfflineBanner, PwaScript } from "@/features/pwa";
import { locale, t } from "@/i18n";
import { restaurantJsonLd } from "@/lib/seo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(tenant.seo.siteUrl),
  title: { default: tenant.seo.title, template: `%s · ${tenant.brand.fullName}` },
  description: tenant.seo.description,
  keywords: tenant.seo.keywords,
  applicationName: tenant.brand.fullName,
  openGraph: {
    type: "website",
    siteName: tenant.brand.fullName,
    title: tenant.seo.title,
    description: tenant.seo.description,
    locale: tenant.locale.numberLocale.replace("-", "_"),
  },
  twitter: { card: "summary_large_image", title: tenant.seo.title, description: tenant.seo.description },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: tenant.brand.name,
    statusBarStyle: tenant.theme.defaultMode === "dark" ? "black-translucent" : "default",
  },
};

const THEME_COLOR: Record<ThemeMode, Viewport["themeColor"]> = {
  light: THEME_BG.light,
  dark: THEME_BG.dark,
  system: [
    { media: "(prefers-color-scheme: light)", color: THEME_BG.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_BG.dark },
  ],
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR[tenant.theme.defaultMode],
  viewportFit: "cover",
};

/** Tenant colours become CSS variables, so the whole design system recolours per client. */
const themeVars = {
  "--ember-1": tenant.theme.gradient[0],
  "--ember-2": tenant.theme.gradient[1],
  "--ember-3": tenant.theme.gradient[2],
  "--accent-light": tenant.theme.accentLight,
  "--accent-dark": tenant.theme.accentDark,
} as CSSProperties;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={locale}
      dir="ltr"
      suppressHydrationWarning
      data-theme={themeAttr(tenant.theme.defaultMode)}
      className={`${geist.variable} ${instrument.variable}`}
      style={themeVars}
    >
      <head>
        <ThemeScript />
        {tenant.pwa.enabled ? <PwaScript serviceWorker={process.env.NODE_ENV === "production"} /> : null}
      </head>
      <body>
        <a
          href="#content"
          className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-full bg-ink px-4 py-2 font-semibold text-bg focus:translate-y-0"
        >
          {t("a11y.skip")}
        </a>
        <PaintDefs />
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
        <CartDrawer />
        <Toaster />
        <CartHydrator />
        {tenant.pwa.enabled ? (
          <>
            <OfflineBanner />
            <InstallCard />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
