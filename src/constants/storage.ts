import { tenant } from "@/config/tenant";

/** localStorage keys, namespaced per tenant so two demos on one domain never collide. */
const ns = (key: string) => `${tenant.id}:${key}`;

export const STORAGE_KEYS = {
  theme: ns("theme"),
  cart: ns("cart"),
  orders: ns("orders"),
  messages: ns("messages"),
  installDismissed: ns("install-dismissed"),
} as const;
