import { tenant } from "@/config/tenant";
import { WEEKDAYS_LONG } from "@/constants/time";

/** schema.org Restaurant for rich results (address, hours, menu, ordering). */
export function restaurantJsonLd() {
  const { contact, brand, seo } = tenant;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: brand.fullName,
    description: brand.description,
    url: seo.siteUrl,
    telephone: contact.phoneE164,
    ...(contact.socials.length ? { sameAs: contact.socials.map((s) => s.url) } : {}),
    servesCuisine: ["Pizza", "Kebab", "Italian"],
    priceRange: "$$",
    hasMenu: `${seo.siteUrl}/menu/`,
    acceptsReservations: false,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.suburb,
      addressRegion: contact.address.state,
      postalCode: contact.address.postcode,
      addressCountry: contact.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.geo.lat, longitude: contact.geo.lng },
    openingHoursSpecification: tenant.hours.flatMap((windows, day) =>
      windows.map((w) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${WEEKDAYS_LONG[day]}`,
        opens: w.open,
        closes: w.close,
      })),
    ),
    potentialAction: {
      "@type": "OrderAction",
      target: `${seo.siteUrl}/menu/`,
      deliveryMethod: [
        "http://purl.org/goodrelations/v1#DeliveryModePickUp",
        "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
      ],
    },
  };
}
