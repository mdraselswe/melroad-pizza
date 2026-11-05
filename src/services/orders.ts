import { tenant } from "@/config/tenant";
import { DEMO_STAGE_SECONDS } from "@/constants/ordering";
import { STORAGE_KEYS } from "@/constants/storage";
import type { CartLine } from "@/features/cart";
import { orderReference } from "@/lib/id";
import type { FulfilmentMode, OrderTotals } from "@/lib/pricing";
import { loyaltyPoints } from "@/lib/pricing";
import { readStorage, writeStorage } from "@/lib/storage";

/**
 * Demo order service. Orders live in localStorage on this device only.
 * Swap these functions for API calls to connect a real POS; the UI only
 * depends on this module's signatures.
 */

export type PaymentMethod = "store" | "card";

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
}

export interface OrderAddress {
  street: string;
  suburb: string;
  postcode: string;
}

export interface Order {
  id: string;
  createdAt: number;
  /** When the customer expects it (epoch ms). */
  dueAt: number;
  scheduled: boolean;
  mode: FulfilmentMode;
  customer: OrderCustomer;
  address?: OrderAddress;
  notes?: string;
  payment: PaymentMethod;
  lines: CartLine[];
  totals: OrderTotals;
  points: number;
}

export type NewOrder = Omit<Order, "id" | "createdAt" | "points">;

const MAX_STORED = 30;

export function listOrders(): Order[] {
  const orders = readStorage<Order[]>(STORAGE_KEYS.orders, []);
  return Array.isArray(orders) ? orders : [];
}

export const getOrder = (id: string | null | undefined): Order | undefined =>
  id ? listOrders().find((o) => o.id === id) : undefined;

export function createOrder(input: NewOrder, now = Date.now()): Order {
  const existing = new Set(listOrders().map((o) => o.id));
  let id = orderReference(tenant.ordering.referencePrefix);
  while (existing.has(id)) id = orderReference(tenant.ordering.referencePrefix);

  const order: Order = {
    ...input,
    id,
    createdAt: now,
    points: tenant.loyalty.enabled ? loyaltyPoints(input.totals.total, tenant.loyalty.pointsPerDollar) : 0,
  };
  writeStorage(STORAGE_KEYS.orders, [order, ...listOrders()].slice(0, MAX_STORED));
  return order;
}

export type OrderStage = "received" | "preparing" | "oven" | "ready" | "delivering" | "done";

/** The stages an order passes through; delivery orders go out instead of waiting at the counter. */
export const stagesFor = (mode: FulfilmentMode): OrderStage[] => [
  "received",
  "preparing",
  "oven",
  mode === "delivery" ? "delivering" : "ready",
  "done",
];

/** Demo progress: stages advance on a fixed timeline after the order is placed. */
export function orderStage(order: Pick<Order, "createdAt" | "mode">, now: number): OrderStage {
  const elapsed = (now - order.createdAt) / 1000;
  if (elapsed >= DEMO_STAGE_SECONDS.done) return "done";
  if (elapsed >= DEMO_STAGE_SECONDS.ready) return order.mode === "delivery" ? "delivering" : "ready";
  if (elapsed >= DEMO_STAGE_SECONDS.oven) return "oven";
  if (elapsed >= DEMO_STAGE_SECONDS.preparing) return "preparing";
  return "received";
}

/** Points earned across stored orders. */
export function pointsBalance(orders: readonly Pick<Order, "points">[]): number {
  return orders.reduce((n, o) => n + o.points, 0);
}
