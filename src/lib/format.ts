import { tenant } from "@/config/tenant";
import type { Cents } from "@/types/money";
import { formatMoney } from "./money";

/** Money in the active tenant's locale and currency. `compact` drops ".00" on whole amounts. */
export const money = (cents: Cents, compact = false) =>
  formatMoney(cents, { locale: tenant.locale.numberLocale, currency: tenant.locale.currency, compact });

/** "7:45 pm" for an epoch time, in the restaurant's time zone. */
export const clockAt = (epochMs: number) =>
  new Intl.DateTimeFormat(tenant.locale.numberLocale, {
    timeZone: tenant.locale.timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(epochMs);
