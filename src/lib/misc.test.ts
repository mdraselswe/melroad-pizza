import { describe, expect, it, vi } from "vitest";
import { orderReference, uid } from "./id";
import { formatMoney, multiplyCents, sumCents, toCents } from "./money";
import { hashString, randomFor, seededRandom } from "./rng";
import { readStorage, writeStorage } from "./storage";

const AUD = { locale: "en-AU", currency: "AUD" };

describe("money", () => {
  it("formats cents as currency", () => {
    expect(formatMoney(1990, AUD)).toBe("$19.90");
    expect(formatMoney(2200, AUD)).toBe("$22.00");
  });

  it("drops cents on whole amounts when compact", () => {
    expect(formatMoney(2200, { ...AUD, compact: true })).toBe("$22");
    expect(formatMoney(2250, { ...AUD, compact: true })).toBe("$22.50");
  });

  it("does integer maths", () => {
    expect(toCents(19.9)).toBe(1990);
    expect(sumCents([100, 250, 5])).toBe(355);
    expect(multiplyCents(1990, 3)).toBe(5970);
  });
});

describe("rng", () => {
  it("hashes deterministically", () => {
    expect(hashString("supreme")).toBe(hashString("supreme"));
    expect(hashString("supreme")).not.toBe(hashString("supremE"));
  });

  it("produces the same sequence for the same seed", () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    const seq = Array.from({ length: 5 }, () => a());
    expect(Array.from({ length: 5 }, () => b())).toEqual(seq);
    for (const n of seq) expect(n >= 0 && n < 1).toBe(true);
    expect(randomFor("x")()).toBe(randomFor("x")());
  });
});

describe("id", () => {
  it("creates readable order references", () => {
    const ref = orderReference("MR", seededRandom(1));
    expect(ref).toMatch(/^MR-[2-9A-HJ-NP-Z]{5}$/);
    expect(orderReference("MR", seededRandom(1))).toBe(ref);
  });

  it("creates unique ids", () => {
    expect(uid()).not.toBe(uid());
  });
});

describe("storage", () => {
  it("round-trips JSON", () => {
    writeStorage("k", { a: 1 });
    expect(readStorage("k", null)).toEqual({ a: 1 });
  });

  it("falls back when storage is broken", () => {
    window.localStorage.setItem("bad", "{not json");
    expect(readStorage("bad", "fallback")).toBe("fallback");
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => writeStorage("k", 1)).not.toThrow();
    spy.mockRestore();
  });
});
