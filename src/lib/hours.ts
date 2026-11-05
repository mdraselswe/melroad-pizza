import type { OpeningWindow } from "@/config/schema";
import { MINUTES_PER_DAY, WEEKDAYS_SHORT } from "@/constants/time";

/** Opening hours in minutes after midnight. `close` may exceed 1440 when a window runs past midnight. */
export interface MinuteWindow {
  open: number;
  close: number;
}

export type WeeklyHours = readonly (readonly OpeningWindow[])[];

export interface ZonedMoment {
  /** 0 = Sunday … 6 = Saturday, in the restaurant's time zone. */
  day: number;
  /** Minutes after midnight, in the restaurant's time zone. */
  minutes: number;
}

export type OpenStatus =
  { open: true; closesAt: number } | { open: false; opensAt: { dayOffset: number; minutes: number } | null };

export function parseTime(value: string): number {
  const [h = 0, m = 0] = value.split(":").map(Number);
  return h * 60 + m;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function windowsForDay(hours: WeeklyHours, day: number): MinuteWindow[] {
  return (hours[mod(day, 7)] ?? []).map(({ open, close }) => {
    const o = parseTime(open);
    let c = parseTime(close);
    if (c <= o) c += MINUTES_PER_DAY;
    return { open: o, close: c };
  });
}

/** Is the shop open at this moment? Includes yesterday's windows that run past midnight. */
export function isOpenAt(hours: WeeklyHours, { day, minutes }: ZonedMoment): MinuteWindow | null {
  const today = windowsForDay(hours, day).find((w) => minutes >= w.open && minutes < w.close);
  if (today) return today;
  const spill = windowsForDay(hours, day - 1).find(
    (w) => w.close > MINUTES_PER_DAY && minutes < w.close - MINUTES_PER_DAY,
  );
  return spill ? { open: spill.open - MINUTES_PER_DAY, close: spill.close - MINUTES_PER_DAY } : null;
}

export function openStatus(hours: WeeklyHours, now: ZonedMoment): OpenStatus {
  const current = isOpenAt(hours, now);
  if (current) return { open: true, closesAt: current.close };
  for (let offset = 0; offset < 8; offset++) {
    const next = windowsForDay(hours, now.day + offset).find((w) => offset > 0 || w.open > now.minutes);
    if (next) return { open: false, opensAt: { dayOffset: offset, minutes: next.open } };
  }
  return { open: false, opensAt: null };
}

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

/** The weekday and minutes-after-midnight of `date` in `timeZone`. */
export function zonedMoment(date: Date, timeZone: string): ZonedMoment {
  let fmt = partsFormatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    partsFormatters.set(timeZone, fmt);
  }
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    day: WEEKDAYS_SHORT.indexOf(parts.weekday as (typeof WEEKDAYS_SHORT)[number]),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** 960 → "4pm", 1425 → "11:45pm", 1530 → "1:30am". */
export function formatClock(minutes: number): string {
  const m = mod(minutes, MINUTES_PER_DAY);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h % 12 || 12}${mm ? `:${String(mm).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
}

export const formatWindow = (w: MinuteWindow) => `${formatClock(w.open)}–${formatClock(w.close)}`;

export interface HoursRow {
  days: string;
  hours: string;
  dayIndexes: number[];
}

/**
 * Groups consecutive days with identical hours, Monday first:
 * "Mon–Thu 4pm–11:45pm", "Fri–Sat 4pm–1:30am", "Sun 1pm–11:30pm".
 */
export function groupHours(hours: WeeklyHours, closedLabel = "Closed"): HoursRow[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const rows: HoursRow[] = [];
  for (const day of order) {
    const label = windowsForDay(hours, day).map(formatWindow).join(", ") || closedLabel;
    const last = rows.at(-1);
    if (last && last.hours === label) last.dayIndexes.push(day);
    else rows.push({ days: "", hours: label, dayIndexes: [day] });
  }
  for (const row of rows) {
    const first = WEEKDAYS_SHORT[row.dayIndexes[0]!];
    const last = WEEKDAYS_SHORT[row.dayIndexes.at(-1)!];
    row.days = row.dayIndexes.length > 1 ? `${first}–${last}` : first!;
  }
  return rows;
}
