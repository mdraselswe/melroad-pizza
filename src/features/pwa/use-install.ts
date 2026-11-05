"use client";

import { useCallback, useSyncExternalStore } from "react";
import { installPlatform, type InstallPlatform } from "./platform";

/** Chromium's install prompt event (not in the DOM typings). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    /** Set by PwaScript, which catches the event before React hydrates. */
    __installPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const PROMPT_READY_EVENT = "install-prompt-ready";

const EVENTS = [PROMPT_READY_EVENT, "appinstalled"] as const;

function subscribe(cb: () => void) {
  EVENTS.forEach((e) => window.addEventListener(e, cb));
  const standalone = window.matchMedia("(display-mode: standalone)");
  standalone.addEventListener("change", cb);
  return () => {
    EVENTS.forEach((e) => window.removeEventListener(e, cb));
    standalone.removeEventListener("change", cb);
  };
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function snapshot(): InstallPlatform {
  return installPlatform({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
    standalone: isStandalone(),
    hasPrompt: Boolean(window.__installPrompt),
  });
}

/** The visitor's install situation, and the native prompt when the browser offers one. Null until mounted. */
export function useInstall() {
  const platform = useSyncExternalStore<InstallPlatform | null>(subscribe, snapshot, () => null);

  const install = useCallback(async () => {
    const event = window.__installPrompt;
    if (!event) return false;
    await event.prompt();
    const { outcome } = await event.userChoice;
    window.__installPrompt = null;
    window.dispatchEvent(new Event(PROMPT_READY_EVENT));
    return outcome === "accepted";
  }, []);

  return { platform, install };
}
