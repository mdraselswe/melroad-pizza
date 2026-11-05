export const THEME_MODES = ["system", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** `data-theme` for a mode: "system" leaves it unset so the media query decides. */
export const themeAttr = (mode: ThemeMode) => (mode === "system" ? undefined : mode);

/** Page background per theme (matches `--bg` in globals.css): browser chrome, splash and app icon tiles. */
export const THEME_BG = { light: "#faf7f3", dark: "#0a0807" } as const;

/** The background the installed app opens with: the default theme, or light when it follows the device. */
export const appBackground = (mode: ThemeMode) => THEME_BG[mode === "dark" ? "dark" : "light"];
