import type { TenantInput } from "@/config/schema";

/**
 * Melroad Pizza n Kebab, Newport VIC.
 * Menu prices were taken from the shop's live ordering site (Nov 2026).
 * Values marked DEMO are placeholders to confirm with the owners.
 */
export const melroadConfig = {
  id: "melroad",
  brand: {
    name: "Melroad",
    fullName: "Melroad Pizza n Kebab",
    tagline: "Newport's late-night pizza & kebab house",
    description:
      "Pizzas, charcoal Adana, halal snack packs, parmas and burgers on Melbourne Road, Newport. Open late every night.",
  },
  contact: {
    phone: "(03) 8794 1237",
    phoneE164: "+61387941237",
    address: {
      street: "422 Melbourne Road",
      suburb: "Newport",
      state: "VIC",
      postcode: "3015",
      country: "AU",
    },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=422+Melbourne+Road+Newport+VIC+3015",
    geo: { lat: -37.8436, lng: 144.8833 },
    socials: [{ kind: "facebook", label: "Facebook", url: "https://www.facebook.com/melroadpizzankebab/" }],
  },
  locale: {
    default: "en",
    available: ["en"],
    numberLocale: "en-AU",
    currency: "AUD",
    timeZone: "Australia/Melbourne",
  },
  // Sun … Sat. A close time earlier than the open time runs past midnight.
  hours: [
    [{ open: "13:00", close: "23:30" }],
    [{ open: "16:00", close: "23:45" }],
    [{ open: "16:00", close: "23:45" }],
    [{ open: "16:00", close: "23:45" }],
    [{ open: "16:00", close: "23:45" }],
    [{ open: "16:00", close: "01:30" }],
    [{ open: "16:00", close: "01:30" }],
  ],
  ordering: {
    referencePrefix: "MR",
    slotMinutes: 15,
    slotsAhead: 24,
    halfAndHalfFee: 200, // DEMO
    pickup: { enabled: true, prepMinutes: 20 },
    delivery: {
      enabled: true,
      prepMinutes: 40,
      fee: 500, // DEMO
      freeOver: 6000, // DEMO
      minimumOrder: 2500, // DEMO
      postcodes: ["3015", "3016", "3018", "3013"],
    },
  },
  pizza: {
    sizes: [
      { id: "M", inch: 11, scale: 0.84 },
      { id: "L", inch: 13, scale: 0.92 },
      { id: "XL", inch: 15, scale: 1 },
    ],
    defaultSize: "L",
    bases: [
      { id: "classic", price: 0 },
      { id: "thin", price: 0 },
      { id: "gf", price: 400 }, // DEMO
    ],
    extras: [
      { id: "cheese", art: "cheese", price: 200 },
      { id: "chicken", art: "chicken", price: 300 },
      { id: "salami", art: "salami", price: 200 },
      { id: "ham", art: "ham", price: 300 },
      { id: "prawn", art: "prawn", price: 300 },
      { id: "anchovy", art: "anchovy", price: 200 },
      { id: "bocconcini", art: "bocconcini", price: 300 },
      { id: "feta", art: "feta", price: 200 },
      { id: "egg", art: "egg", price: 200 },
      { id: "mushroom", art: "mushroom", price: 200 },
      { id: "capsicum", art: "capsicum", price: 200 },
      { id: "olive", art: "olive", price: 200 },
      { id: "pineapple", art: "pineapple", price: 200 },
      { id: "onion", art: "onion", price: 200 },
      { id: "spinach", art: "spinach", price: 200 },
      { id: "jalapeno", art: "jalapeno", price: 200 },
      { id: "chilli", art: "chilli", price: 200 },
    ],
  },
  loyalty: {
    enabled: true,
    pointsPerDollar: 10,
    rewardThreshold: 1500,
    rewardValue: 1500,
  },
  theme: {
    gradient: ["#ff7a1a", "#f2361f", "#ffb23f"],
    accentLight: "#e8431c",
    accentDark: "#ff5a1f",
    defaultMode: "dark",
  },
  seo: {
    siteUrl: "https://pizza.shojashapta.com",
    title: "Melroad Pizza n Kebab · Newport VIC",
    description:
      "Order pizza, kebabs, parmas and burgers from Melroad Pizza n Kebab, 422 Melbourne Road, Newport. Open till 1:30am Fri & Sat. Pickup or delivery.",
    keywords: ["pizza Newport", "kebab Newport", "late night pizza Melbourne", "halal snack pack", "Melroad"],
  },
  demo: { enabled: true },
  content: {
    en: {
      heroHeadline: "Newport's late-night [pizza] & kebab house.",
      heroLede:
        "Pizzas, charcoal Adana, halal snack packs, parmas and burgers. Build yours topping by topping, then pick it up or have it delivered.",
      ringText: "OPEN LATE · PIZZA · KEBAB · PARMAS · BURGERS · NEWPORT VIC · ",
      stats: [
        { value: "13", label: "traditional pizzas" },
        { value: "14", label: "gourmet pizzas" },
        { value: "1:30am", label: "Fri & Sat close" },
      ],
      aboutTitle: "Fired up on [Melbourne Road].",
      aboutBody:
        "A local favourite on Melbourne Road in Newport, cooking pizza, kebabs and parmas into the early hours. Everything is made to order — pick it up hot or have it brought to your door.",
    },
  },
} satisfies TenantInput;
