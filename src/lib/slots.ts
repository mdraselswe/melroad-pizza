import { MINUTES_PER_DAY } from "@/constants/time";
import { isOpenAt, type WeeklyHours, type ZonedMoment } from "./hours";

export interface TimeSlot {
  /** Stable value: "<dayOffset>@<minutes>" in restaurant time. */
  value: string;
  dayOffset: number;
  minutes: number;
}

interface BuildSlotsOptions {
  hours: WeeklyHours;
  now: ZonedMoment;
  prepMinutes: number;
  slotMinutes: number;
  count: number;
  /** How far ahead to search, in days. */
  horizonDays?: number;
}

/**
 * Future pickup/delivery times while the shop is open, starting after the
 * kitchen's prep time and snapped to the slot grid.
 */
export function buildSlots({
  hours,
  now,
  prepMinutes,
  slotMinutes,
  count,
  horizonDays = 2,
}: BuildSlotsOptions): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const first = Math.ceil((now.minutes + prepMinutes) / slotMinutes) * slotMinutes;
  const end = now.minutes + horizonDays * MINUTES_PER_DAY;
  for (let t = first; t <= end && slots.length < count; t += slotMinutes) {
    const dayOffset = Math.floor(t / MINUTES_PER_DAY);
    const minutes = t % MINUTES_PER_DAY;
    if (isOpenAt(hours, { day: now.day + dayOffset, minutes })) {
      slots.push({ value: `${dayOffset}@${minutes}`, dayOffset, minutes });
    }
  }
  return slots;
}

export function parseSlot(value: string): Pick<TimeSlot, "dayOffset" | "minutes"> | null {
  const match = /^(\d+)@(\d+)$/.exec(value);
  return match ? { dayOffset: Number(match[1]), minutes: Number(match[2]) } : null;
}
