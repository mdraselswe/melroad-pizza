"use client";

import { Moon, SunMedium, SunMoon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { t } from "@/i18n";

const ICONS = { system: SunMoon, light: SunMedium, dark: Moon } as const;

export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const Icon = ICONS[mode];
  const label = t(`theme.${mode}`);
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="grid size-[38px] place-items-center rounded-full border border-line transition-colors hover:bg-faint"
    >
      <Icon className="size-[18px]" aria-hidden="true" />
    </button>
  );
}
