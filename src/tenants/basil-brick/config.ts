import type { TenantInput } from "@/config/schema";
import { melroadConfig } from "../melroad/config";

/**
 * A fictional second client that proves the white-label setup: different
 * brand, colours, hours, delivery area and a smaller menu, zero feature code.
 * Build it with `NEXT_PUBLIC_TENANT=basil-brick npm run build`.
 */
export const basilBrickConfig = {
  ...melroadConfig,
  id: "basil-brick",
  brand: {
    name: "Basil & Brick",
    fullName: "Basil & Brick Woodfired",
    tagline: "Woodfired pizza, slow Sundays",
    description:
      "Neighbourhood woodfired pizza and pasta. Sourdough bases, fresh basil and a brick oven at 450°.",
  },
  contact: {
    ...melroadConfig.contact,
    phone: "(03) 9000 0000",
    phoneE164: "+61390000000",
    address: { street: "12 Example Lane", suburb: "Fitzroy", state: "VIC", postcode: "3065", country: "AU" },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fitzroy+VIC+3065",
    geo: { lat: -37.7987, lng: 144.9784 },
  },
  hours: [
    [{ open: "12:00", close: "21:00" }],
    [],
    [{ open: "17:00", close: "22:00" }],
    [{ open: "17:00", close: "22:00" }],
    [{ open: "17:00", close: "22:00" }],
    [{ open: "12:00", close: "23:00" }],
    [{ open: "12:00", close: "23:00" }],
  ],
  ordering: {
    ...melroadConfig.ordering,
    referencePrefix: "BB",
    delivery: {
      ...melroadConfig.ordering.delivery,
      fee: 700,
      freeOver: undefined,
      postcodes: ["3065", "3066", "3068"],
    },
  },
  loyalty: { ...melroadConfig.loyalty, enabled: false },
  theme: { gradient: ["#3fae5a", "#1f7a4a", "#c7e86a"], accentLight: "#2a7d45", accentDark: "#5fd07e" },
  seo: {
    siteUrl: "https://basil-brick.example.com",
    title: "Basil & Brick Woodfired · Fitzroy",
    description: "Woodfired sourdough pizza in Fitzroy. Order online for pickup or delivery.",
    keywords: ["woodfired pizza Fitzroy"],
  },
  content: {
    en: {
      heroHeadline: "Sourdough, smoke and fresh [basil].",
      heroLede:
        "Forty-eight hour sourdough, San Marzano tomatoes and a brick oven at 450°. Build yours and we'll fire it.",
      ringText: "WOODFIRED · SOURDOUGH · FITZROY · SINCE 2019 · ",
      stats: [
        { value: "48h", label: "dough proof" },
        { value: "450°", label: "brick oven" },
        { value: "90s", label: "bake time" },
      ],
      aboutTitle: "A brick oven on [Example Lane].",
      aboutBody:
        "We keep it short: good flour, long fermentation, a hot oven and toppings that earn their place.",
    },
  },
} satisfies TenantInput;
