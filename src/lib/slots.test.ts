import { describe, expect, it } from "vitest";
import { buildSlots, parseSlot } from "./slots";

const HOURS = [
  [{ open: "13:00", close: "23:30" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "01:30" }],
  [{ open: "16:00", close: "01:30" }],
];
const base = { hours: HOURS, prepMinutes: 20, slotMinutes: 15 };

describe("buildSlots", () => {
  it("starts after prep time, snapped to the grid", () => {
    const slots = buildSlots({ ...base, now: { day: 2, minutes: 17 * 60 + 2 }, count: 3 });
    // 5:02pm + 20 min prep = 5:22pm, next slot on the grid is 5:30pm.
    expect(slots.map((s) => s.value)).toEqual(["0@1050", "0@1065", "0@1080"]);
  });

  it("skips closed hours and continues into tomorrow", () => {
    const slots = buildSlots({ ...base, now: { day: 2, minutes: 23 * 60 + 30 }, count: 2 });
    expect(slots).toEqual([
      { value: "1@960", dayOffset: 1, minutes: 960 },
      { value: "1@975", dayOffset: 1, minutes: 975 },
    ]);
  });

  it("offers after-midnight slots on late nights", () => {
    const slots = buildSlots({ ...base, now: { day: 5, minutes: 23 * 60 + 50 }, count: 10 });
    expect(slots[0]).toEqual({ value: "1@15", dayOffset: 1, minutes: 15 });
    expect(slots.filter((s) => s.dayOffset === 1 && s.minutes < 120).at(-1)?.minutes).toBe(75);
  });

  it("round-trips slot values", () => {
    expect(parseSlot("1@975")).toEqual({ dayOffset: 1, minutes: 975 });
    expect(parseSlot("asap")).toBeNull();
  });
});
