"use client";

import { tenant } from "@/config/tenant";
import { WEEKDAYS_LONG } from "@/constants/time";
import { formatClock, openStatus, zonedMoment, type OpenStatus } from "@/lib/hours";
import { t } from "@/i18n";
import { useNow } from "./use-now";

export interface OpenStatusView {
  status: OpenStatus | null;
  label: string | null;
}

export function describeStatus(status: OpenStatus, today: number): string {
  if (status.open) return t("status.closes", { time: formatClock(status.closesAt) });
  if (!status.opensAt) return t("status.closed");
  const { dayOffset, minutes } = status.opensAt;
  const time = formatClock(minutes);
  if (dayOffset === 0) return t("status.opensToday", { time });
  if (dayOffset === 1) return t("status.opensTomorrow", { time });
  return t("status.opensOn", { day: WEEKDAYS_LONG[(today + dayOffset) % 7]!, time });
}

/** Live "Open now · closes 1:30am" status in the restaurant's time zone. */
export function useOpenStatus(): OpenStatusView {
  const now = useNow();
  if (!now) return { status: null, label: null };
  const moment = zonedMoment(now, tenant.locale.timeZone);
  const status = openStatus(tenant.hours, moment);
  return { status, label: describeStatus(status, moment.day) };
}
