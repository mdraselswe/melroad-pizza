import { describe, expect, it } from "vitest";
import {
  formatClock,
  groupHours,
  isOpenAt,
  openStatus,
  parseTime,
  windowsForDay,
  zonedMoment,
} from "./hours";

const HOURS = [
  [{ open: "13:00", close: "23:30" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "23:45" }],
  [{ open: "16:00", close: "01:30" }],
  [{ open: "16:00", close: "01:30" }],
];
const WITH_CLOSED_MONDAY = HOURS.map((d, i) => (i === 1 ? [] : d));

describe("hours", () => {
  it("parses HH:MM", () => {
    expect(parseTime("00:00")).toBe(0);
    expect(parseTime("16:45")).toBe(1005);
  });

  it("extends windows that run past midnight", () => {
    expect(windowsForDay(HOURS, 5)).toEqual([{ open: 960, close: 1530 }]);
    expect(windowsForDay(HOURS, 1)).toEqual([{ open: 960, close: 1425 }]);
    expect(windowsForDay(HOURS, -1)).toEqual(windowsForDay(HOURS, 6));
  });

  it("knows when the shop is open", () => {
    expect(isOpenAt(HOURS, { day: 1, minutes: 15 * 60 })).toBeNull();
    expect(isOpenAt(HOURS, { day: 1, minutes: 16 * 60 })).not.toBeNull();
    expect(isOpenAt(HOURS, { day: 1, minutes: 1425 })).toBeNull();
  });

  it("counts Friday night's late close on Saturday morning", () => {
    expect(isOpenAt(HOURS, { day: 6, minutes: 60 })).toEqual({ open: 960 - 1440, close: 90 });
    expect(isOpenAt(HOURS, { day: 6, minutes: 90 })).toBeNull();
    // Thursday closes before midnight, so early Friday is closed.
    expect(isOpenAt(HOURS, { day: 5, minutes: 30 })).toBeNull();
  });

  it("reports the next opening time", () => {
    expect(openStatus(HOURS, { day: 2, minutes: 600 })).toEqual({
      open: false,
      opensAt: { dayOffset: 0, minutes: 960 },
    });
    expect(openStatus(HOURS, { day: 2, minutes: 1430 })).toEqual({
      open: false,
      opensAt: { dayOffset: 1, minutes: 960 },
    });
    expect(openStatus(HOURS, { day: 6, minutes: 30 })).toEqual({ open: true, closesAt: 90 });
    expect(openStatus(WITH_CLOSED_MONDAY, { day: 0, minutes: 1430 })).toEqual({
      open: false,
      opensAt: { dayOffset: 2, minutes: 960 },
    });
    expect(openStatus([[], [], [], [], [], [], []], { day: 0, minutes: 0 })).toEqual({
      open: false,
      opensAt: null,
    });
  });

  it("formats clock times", () => {
    expect(formatClock(960)).toBe("4pm");
    expect(formatClock(1425)).toBe("11:45pm");
    expect(formatClock(1530)).toBe("1:30am");
    expect(formatClock(0)).toBe("12am");
    expect(formatClock(720)).toBe("12pm");
  });

  it("groups identical days for display", () => {
    expect(groupHours(HOURS).map(({ days, hours }) => `${days} ${hours}`)).toEqual([
      "Mon–Thu 4pm–11:45pm",
      "Fri–Sat 4pm–1:30am",
      "Sun 1pm–11:30pm",
    ]);
    expect(groupHours(WITH_CLOSED_MONDAY)[0]).toMatchObject({ days: "Mon", hours: "Closed" });
  });

  it("reads the weekday and time in the restaurant's zone", () => {
    // 2026-11-06 06:00 UTC is Friday 5pm in Melbourne (AEDT, UTC+11).
    expect(zonedMoment(new Date("2026-11-06T06:00:00Z"), "Australia/Melbourne")).toEqual({
      day: 5,
      minutes: 17 * 60,
    });
  });
});
