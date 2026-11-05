"use client";

import { useCallback, useSyncExternalStore } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { tenant } from "@/config/tenant";
import { THEME_MODES, type ThemeMode } from "@/constants/theme";

const DEFAULT_MODE: ThemeMode = tenant.theme.defaultMode;

const listeners = new Set<() => void>();

function read(): ThemeMode {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.theme);
    return (THEME_MODES as readonly string[]).includes(value ?? "") ? (value as ThemeMode) : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = mode;
}

/** Light / dark / match-device theme, persisted per tenant. The pre-paint script lives in ThemeScript. */
export function useTheme() {
  const mode = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => DEFAULT_MODE,
  );

  const setMode = useCallback((next: ThemeMode) => {
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, next);
    } catch {
      /* storage unavailable: the choice lasts for this page view */
    }
    listeners.forEach((cb) => cb());
  }, []);

  const cycle = useCallback(
    () => setMode(THEME_MODES[(THEME_MODES.indexOf(read()) + 1) % THEME_MODES.length]!),
    [setMode],
  );

  return { mode, setMode, cycle };
}
