import type { Cents } from "@/types/money";

/** Builds a currency formatter for the active tenant. Cached per locale/currency pair. */
const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(
  cents: Cents,
  { locale, currency, compact = false }: { locale: string; currency: string; compact?: boolean },
): string {
  const whole = cents % 100 === 0;
  const key = `${locale}|${currency}|${compact && whole}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: compact && whole ? 0 : 2,
      maximumFractionDigits: compact && whole ? 0 : 2,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(cents / 100);
}

/** Converts a dollar amount such as 19.5 to integer cents, avoiding float drift. */
export const toCents = (dollars: number): Cents => Math.round(dollars * 100);

export const sumCents = (values: readonly Cents[]): Cents => values.reduce((total, v) => total + v, 0);

export const multiplyCents = (cents: Cents, quantity: number): Cents => Math.round(cents * quantity);
