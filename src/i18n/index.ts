import { tenant } from "@/config/tenant";
import { en, type MessageKey, type Messages } from "./messages/en";

/**
 * A deliberately tiny, typed translator. Add a locale by creating
 * `messages/<locale>.ts` that satisfies `Messages` and registering it here.
 */
const CATALOGUE: Record<string, Messages> = { en };

export type TranslateVars = Record<string, string | number>;
export type Translate = (key: MessageKey, vars?: TranslateVars) => string;

export function createTranslator(messages: Messages): Translate {
  return (key, vars) => {
    const template: string = messages[key] ?? en[key] ?? key;
    return vars
      ? template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
      : template;
  };
}

export const locale = tenant.locale.default in CATALOGUE ? tenant.locale.default : "en";
export const t = createTranslator(CATALOGUE[locale] ?? en);

const isKey = (key: string): key is MessageKey => key in en;

/** For keys built from data (e.g. `size.${id}`): falls back to `fallback` when no message exists. */
export function tDynamic(key: string, fallback: string, vars?: TranslateVars): string {
  return isKey(key) ? t(key, vars) : fallback;
}

export type { MessageKey };
