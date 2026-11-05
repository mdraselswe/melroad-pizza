import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/layout/theme-script";
import { tenant } from "@/config/tenant";
import { CartDrawer, CartHydrator, Toaster } from "@/features/cart";
import { PaintDefs } from "@/features/pizza-art";
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0807" },
  ],
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
      className={`${geist.variable} ${instrument.variable}`}
      style={themeVars}
    >
      <head>
        <ThemeScript />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
