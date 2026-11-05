"use client";

import {
  AppWindow,
  Download,
  EllipsisVertical,
  MonitorDown,
  Share,
  SquarePlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { tenant } from "@/config/tenant";
import { STORAGE_KEYS } from "@/constants/storage";
import { t, type MessageKey } from "@/i18n";
import { readStorage, writeStorage } from "@/lib/storage";
import { useInstallCard } from "../install-store";
import type { InstallPlatform } from "../platform";
import { useInstall } from "../use-install";

/** After "Not now", wait this long before popping up again. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

const STEPS: Partial<Record<InstallPlatform, [LucideIcon, MessageKey][]>> = {
  ios: [
    [Share, "pwa.ios1"],
    [SquarePlus, "pwa.ios2"],
    [AppWindow, "pwa.ios3"],
  ],
  android: [
    [EllipsisVertical, "pwa.android1"],
    [Download, "pwa.android2"],
    [AppWindow, "pwa.android3"],
  ],
  desktop: [
    [MonitorDown, "pwa.desktop1"],
    [EllipsisVertical, "pwa.desktop2"],
    [AppWindow, "pwa.desktop3"],
  ],
  "mac-safari": [
    [SquarePlus, "pwa.mac1"],
    [AppWindow, "pwa.mac2"],
  ],
};

/** Step copy with `[Label]` shown as the button name to look for. */
function StepText({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") ? (
      <b key={i} className="font-semibold text-ink">
        {part.slice(1, -1)}
      </b>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * "Install the app" card. Pops up once after a short visit (then snoozes),
 * and opens any time from the footer. Uses the browser's own prompt where
 * there is one, otherwise shows the steps for this device.
 */
export function InstallCard() {
  const { platform, install } = useInstall();
  const { open, show, hide } = useInstallCard();
  const titleId = useId();
  const name = tenant.brand.name;

  const dismiss = useCallback(() => {
    writeStorage(STORAGE_KEYS.installDismissed, Date.now());
    hide();
  }, [hide]);

  useEffect(() => {
    if (!platform || platform === "installed" || platform === "unsupported") return;
    if (Date.now() - readStorage<number>(STORAGE_KEYS.installDismissed, 0) < SNOOZE_MS) return;
    const id = setTimeout(show, tenant.pwa.promptDelaySeconds * 1000);
    return () => clearTimeout(id);
  }, [platform, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open || !platform || platform === "installed") return null;

  const steps = STEPS[platform];

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-[90] mx-auto max-w-[420px] animate-[pop-in_.35s_var(--ease-out-soft)_both] rounded-[var(--radius-panel)] border border-line bg-solid p-5 shadow-[0_30px_60px_-24px_var(--shadow)] sm:right-5 sm:left-auto sm:mx-0"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("pwa.close")}
        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-faint hover:text-ink"
      >
        <X className="size-[18px]" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-3.5 pr-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- static app icon */}
        <img src="/icon-192.png" alt="" width={52} height={52} className="size-[52px] rounded-[14px]" />
        <div className="grid gap-0.5">
          <h2 id={titleId} className="m-0 text-[17px] font-bold tracking-[-.02em]">
            {t("pwa.title", { name })}
          </h2>
          <p className="m-0 text-[14px] leading-snug text-muted">{t("pwa.sub")}</p>
        </div>
      </div>

      {platform === "prompt" ? (
        <div className="mt-5 flex gap-2.5">
          <Button onClick={() => void install().then(hide)} className="flex-1">
            <Download className="size-[17px]" aria-hidden="true" />
            {t("pwa.install")}
          </Button>
          <Button variant="ghost" onClick={dismiss}>
            {t("pwa.later")}
          </Button>
        </div>
      ) : steps ? (
        <ol className="m-0 mt-5 grid list-none gap-3 p-0">
          {steps.map(([Icon, key], i) => (
            <li key={key} className="flex items-center gap-3 text-[15px] text-muted">
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-faint text-accent">
                <Icon className="size-[18px]" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 grid size-[18px] place-items-center rounded-full bg-accent text-[11px] font-bold text-on-accent">
                  {i + 1}
                </span>
              </span>
              <span>
                <StepText text={t(key, { name })} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="m-0 mt-4 text-[15px] text-muted">{t("pwa.unsupported")}</p>
      )}
    </section>
  );
}

/** Footer link that opens the install card; hidden once the app is installed. */
export function InstallLink({ className }: { className?: string }) {
  const { platform } = useInstall();
  const show = useInstallCard((s) => s.show);
  if (!platform || platform === "installed") return null;
  return (
    <button type="button" onClick={show} className={className}>
      {t("pwa.footer")}
    </button>
  );
}
