import { describe, expect, it } from "vitest";
import { installPlatform } from "./platform";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1",
  ipadOS:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  androidFirefox: "Mozilla/5.0 (Android 14; Mobile; rv:133.0) Gecko/133.0 Firefox/133.0",
  winEdge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
  winFirefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
};

const env = (userAgent: string, extra: Partial<Parameters<typeof installPlatform>[0]> = {}) =>
  installPlatform({ userAgent, maxTouchPoints: 0, standalone: false, hasPrompt: false, ...extra });

describe("installPlatform", () => {
  it("detects an installed app first", () => {
    expect(env(UA.androidChrome, { standalone: true, hasPrompt: true })).toBe("installed");
  });

  it("uses Share → Add to Home Screen on iPhone and iPadOS", () => {
    expect(env(UA.iphone)).toBe("ios");
    expect(env(UA.ipadOS, { maxTouchPoints: 5 })).toBe("ios");
  });

  it("prefers the native prompt when the browser offers one", () => {
    expect(env(UA.androidChrome, { hasPrompt: true })).toBe("prompt");
    expect(env(UA.winEdge, { hasPrompt: true })).toBe("prompt");
  });

  it("falls back to manual steps without a prompt", () => {
    expect(env(UA.androidChrome)).toBe("android");
    expect(env(UA.androidFirefox)).toBe("android");
    expect(env(UA.macChrome)).toBe("desktop");
    expect(env(UA.winEdge)).toBe("desktop");
    expect(env(UA.macSafari)).toBe("mac-safari");
  });

  it("flags desktop browsers that cannot install", () => {
    expect(env(UA.winFirefox)).toBe("unsupported");
  });
});
