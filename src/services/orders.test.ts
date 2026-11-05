import { beforeEach, describe, expect, it } from "vitest";
import {
  createOrder,
  getOrder,
  listOrders,
  orderStage,
  pointsBalance,
  stagesFor,
  type NewOrder,
} from "./orders";

const input: NewOrder = {
  dueAt: 0,
  scheduled: false,
  mode: "pickup",
  customer: { name: "Sam", phone: "0400000000" },
  payment: "store",
  lines: [],
  totals: { subtotal: 4600, deliveryFee: 0, total: 4600, belowMinimum: 0 },
};

describe("order service", () => {
  beforeEach(() => localStorage.clear());

  it("stores orders newest first with a tenant reference and points", () => {
    const a = createOrder(input, 1);
    const b = createOrder({ ...input, totals: { ...input.totals, total: 1000 } }, 2);
    expect(a.id).toMatch(/^MR-[2-9A-Z]{5}$/);
    expect(a.points).toBe(460);
    expect(listOrders().map((o) => o.id)).toEqual([b.id, a.id]);
    expect(getOrder(a.id)?.customer.name).toBe("Sam");
    expect(getOrder("nope")).toBeUndefined();
    expect(pointsBalance(listOrders())).toBe(560);
  });

  it("survives corrupt storage", () => {
    localStorage.setItem("melroad:orders", "{not json");
    expect(listOrders()).toEqual([]);
  });

  it("advances demo stages over time", () => {
    const at = (s: number, mode: "pickup" | "delivery" = "pickup") =>
      orderStage({ createdAt: 0, mode }, s * 1000);
    expect([at(0), at(13), at(40), at(80), at(200)]).toEqual([
      "received",
      "preparing",
      "oven",
      "ready",
      "done",
    ]);
    expect(at(80, "delivery")).toBe("delivering");
    expect(stagesFor("delivery")).toContain("delivering");
  });
});
