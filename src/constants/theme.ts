export const THEME_MODES = ["system", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** `data-theme` for a mode: "system" leaves it unset so the media query decides. */
export const themeAttr = (mode: ThemeMode) => (mode === "system" ? undefined : mode);
