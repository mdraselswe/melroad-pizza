"use client";

import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";
import { t } from "@/i18n";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/** A small pill under the header while the device is offline. */
export function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <div
      role="status"
      className="fixed top-[calc(env(safe-area-inset-top,0px)+84px)] left-1/2 z-[80] flex -translate-x-1/2 animate-[pop-in_.3s_var(--ease-out-soft)_both] items-center gap-2 rounded-full bg-ink px-4 py-2 text-[14px] font-semibold whitespace-nowrap text-bg shadow-[0_16px_32px_-16px_var(--shadow)]"
    >
      <WifiOff className="size-4" aria-hidden="true" />
      {t("pwa.offline")}
    </div>
  );
}
