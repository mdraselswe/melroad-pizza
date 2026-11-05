import { z } from "zod";

/**
 * Everything that makes one restaurant different from another lives in a
 * tenant config validated by these schemas. Selling the product to a new
 * client means adding a folder under `src/tenants/` — never editing features.
 */

const cents = z.number().int().nonnegative();
const time = z.string().regex(/^\d{2}:\d{2}$/, "Use 24h HH:MM");
const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i);

/** One opening window. A close earlier than the open time runs past midnight. */
export const OpeningWindowSchema = z.object({ open: time, close: time });

export const PizzaSizeSchema = z.object({
  id: z.string(),
  inch: z.number().positive(),
  /** Visual scale of the pizza in the builder, 0–1. */
  scale: z.number().min(0.5).max(1),
});

export const PizzaBaseSchema = z.object({ id: z.string(), price: cents });

export const ToppingExtraSchema = z.object({
  id: z.string(),
  /** Topping artwork id from the pizza-art feature. */
  art: z.string(),
  price: cents,
});

export const ContentSchema = z.object({
  heroHeadline: z.string().describe("Wrap the accent word in [brackets]"),
  heroLede: z.string(),
  ringText: z.string(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).max(4),
  aboutTitle: z.string(),
  aboutBody: z.string(),
});

export const TenantSchema = z.object({
  id: z.string(),
  brand: z.object({
    name: z.string(),
    fullName: z.string(),
    tagline: z.string(),
    description: z.string(),
  }),
  contact: z.object({
    phone: z.string(),
    phoneE164: z.string(),
    email: z.string().email().optional(),
    address: z.object({
      street: z.string(),
      suburb: z.string(),
      state: z.string(),
      postcode: z.string(),
      country: z.string(),
    }),
    mapsUrl: z.string().url(),
    geo: z.object({ lat: z.number(), lng: z.number() }),
    socials: z.array(z.object({ label: z.string(), url: z.string().url() })),
  }),
  locale: z.object({
    default: z.string(),
    available: z.array(z.string()).min(1),
    numberLocale: z.string(),
    currency: z.string().length(3),
    timeZone: z.string(),
  }),
  /** Index 0 = Sunday … 6 = Saturday. An empty array means closed all day. */
  hours: z.array(z.array(OpeningWindowSchema)).length(7),
  ordering: z.object({
    /** Prefix for order references, e.g. "MR" gives "MR-7K2QX". */
    referencePrefix: z
      .string()
      .regex(/^[A-Z]{1,4}$/)
      .default("ORD"),
    slotMinutes: z.number().int().positive(),
    slotsAhead: z.number().int().positive(),
    halfAndHalfFee: cents,
    pickup: z.object({ enabled: z.boolean(), prepMinutes: z.number().int().positive() }),
    delivery: z.object({
      enabled: z.boolean(),
      prepMinutes: z.number().int().positive(),
      fee: cents,
      freeOver: cents.optional(),
      minimumOrder: cents,
      postcodes: z.array(z.string()),
    }),
  }),
  pizza: z.object({
    sizes: z.array(PizzaSizeSchema).min(1),
    defaultSize: z.string(),
    bases: z.array(PizzaBaseSchema).min(1),
    extras: z.array(ToppingExtraSchema),
  }),
  loyalty: z.object({
    enabled: z.boolean(),
    pointsPerDollar: z.number().positive(),
    rewardThreshold: z.number().int().positive(),
    rewardValue: cents,
  }),
  theme: z.object({
    /** Three stops of the signature gradient, warm to hot to highlight. */
    gradient: z.tuple([hexColor, hexColor, hexColor]),
    accentLight: hexColor,
    accentDark: hexColor,
  }),
  seo: z.object({
    siteUrl: z.string().url(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
  demo: z.object({ enabled: z.boolean() }),
  content: z.record(z.string(), ContentSchema),
});

export type Tenant = z.infer<typeof TenantSchema>;
export type TenantContent = z.infer<typeof ContentSchema>;
export type OpeningWindow = z.infer<typeof OpeningWindowSchema>;
export type PizzaSize = z.infer<typeof PizzaSizeSchema>;
export type PizzaBase = z.infer<typeof PizzaBaseSchema>;
export type ToppingExtra = z.infer<typeof ToppingExtraSchema>;
export type TenantInput = z.input<typeof TenantSchema>;
