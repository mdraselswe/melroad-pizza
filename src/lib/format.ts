import { tenant } from "@/config/tenant";
import type { Cents } from "@/types/money";
import { formatMoney } from "./money";

/** Money in the active tenant's locale and currency. `compact` drops ".00" on whole amounts. */
export const money = (cents: Cents, compact = false) =>
  formatMoney(cents, { locale: tenant.locale.numberLocale, currency: tenant.locale.currency, compact });
