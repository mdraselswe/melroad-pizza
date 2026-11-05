/**
 * Which install instructions to show. Pure, so it is unit tested; the browser
 * facts are gathered by `readEnvironment()` in use-install.ts.
 */
export type InstallPlatform =
  /** Already running as an installed app. */
  | "installed"
  /** The browser offered a native install prompt (Chrome, Edge, Samsung, Android). */
  | "prompt"
  /** iPhone / iPad: Share → Add to Home Screen. */
  | "ios"
  /** Android browser without a prompt: browser menu → Install / Add to Home screen. */
  | "android"
  /** Safari on macOS: File → Add to Dock. */
  | "mac-safari"
  /** Chromium desktop before (or after dismissing) the prompt: address-bar install icon. */
  | "desktop"
  /** Desktop browsers that can't install sites (Firefox). */
  | "unsupported";

export interface InstallEnvironment {
  userAgent: string;
  /** navigator.maxTouchPoints, to tell iPadOS (which reports as a Mac) from a Mac. */
  maxTouchPoints: number;
  standalone: boolean;
  hasPrompt: boolean;
}

export function installPlatform({
  userAgent: ua,
  maxTouchPoints,
  standalone,
  hasPrompt,
}: InstallEnvironment): InstallPlatform {
  if (standalone) return "installed";
  const iPadOS = /Macintosh/.test(ua) && maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || iPadOS) return "ios";
  if (hasPrompt) return "prompt";
  if (/Android/.test(ua)) return "android";
  const chromium = /Chrome\/|Chromium\/|Edg\//.test(ua);
  if (/Macintosh/.test(ua) && /Safari\//.test(ua) && !chromium && !/Firefox\//.test(ua)) return "mac-safari";
  if (chromium) return "desktop";
  return "unsupported";
}

/** Platforms where showing instructions is useful. */
export const canInstall = (p: InstallPlatform) => p !== "installed";
