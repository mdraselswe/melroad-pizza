"use client";

import { useMemo } from "react";
import { tenant } from "@/config/tenant";
import { MINUTES_PER_DAY, WEEKDAYS_LONG } from "@/constants/time";
import { useNow } from "@/hooks/use-now";
import { t } from "@/i18n";
import { formatClock, isOpenAt, zonedMoment, type ZonedMoment } from "@/lib/hours";
import type { FulfilmentMode } from "@/lib/pricing";
import { buildSlots, parseSlot } from "@/lib/slots";

export interface SlotGroup {
  label: string;
  slots: { value: string; label: string }[];
}

const dayLabel = (moment: ZonedMoment, dayOffset: number) =>
  dayOffset === 0
    ? t("checkout.today")
    : dayOffset === 1
      ? t("checkout.tomorrow")
      : WEEKDAYS_LONG[(moment.day + dayOffset) % 7]!;

/** Upcoming time slots for the chosen mode, grouped by day, plus whether ASAP is possible now. */
export function useCheckoutSlots(mode: FulfilmentMode) {
  const now = useNow();
  const prepMinutes = tenant.ordering[mode].prepMinutes;

  return useMemo(() => {
    if (!now) return { now, moment: null, canAsap: false, groups: [] as SlotGroup[], prepMinutes };
    const moment = zonedMoment(now, tenant.locale.timeZone);
    const slots = buildSlots({
      hours: tenant.hours,
      now: moment,
      prepMinutes,
      slotMinutes: tenant.ordering.slotMinutes,
      count: tenant.ordering.slotsAhead,
    });
    const groups: SlotGroup[] = [];
    for (const s of slots) {
      const label = dayLabel(moment, s.dayOffset);
      let group = groups.find((g) => g.label === label);
      if (!group) groups.push((group = { label, slots: [] }));
      group.slots.push({ value: s.value, label: formatClock(s.minutes) });
    }
    return { now, moment, canAsap: !!isOpenAt(tenant.hours, moment), groups, prepMinutes };
  }, [now, prepMinutes]);
}

/** Epoch ms for an ASAP order or a chosen slot, relative to the restaurant clock. */
export function dueTime(now: Date, moment: ZonedMoment, prepMinutes: number, slot?: string): number {
  const parsed = slot ? parseSlot(slot) : null;
  if (!parsed) return now.getTime() + prepMinutes * 60_000;
  const minutesAhead = parsed.dayOffset * MINUTES_PER_DAY + parsed.minutes - moment.minutes;
  return now.getTime() + minutesAhead * 60_000;
}
