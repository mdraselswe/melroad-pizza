"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  closeLabel: string;
  /** "side" slides in from the right (cart); "center" is a bottom sheet on mobile and a dialog on desktop. */
  variant?: "side" | "center";
  /** Content above the title, e.g. a hero image. */
  media?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const PANEL = {
  side: "inset-y-0 right-0 w-[min(440px,100vw)] data-[state=closed]:animate-[slide-out-right_.25s_both] data-[state=open]:animate-[slide-in-right_.45s_var(--ease-out-soft)_both] sm:inset-y-3 sm:right-3 sm:rounded-[var(--radius-panel)]",
  center:
    "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[var(--radius-panel)] data-[state=closed]:animate-[slide-out-down_.25s_both] data-[state=open]:animate-[slide-in-up_.45s_var(--ease-out-soft)_both] sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[88dvh] sm:w-[min(580px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[var(--radius-panel)] sm:data-[state=closed]:animate-[fade-out_.2s_both] sm:data-[state=open]:animate-[pop-in_.35s_var(--ease-out-soft)_both]",
};

/** Accessible modal sheet (focus trap, Escape, scroll lock) built on Radix Dialog. */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  variant = "center",
  media,
  footer,
  children,
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[rgb(10_6_4/.45)] backdrop-blur-[3px] data-[state=closed]:animate-[fade-out_.2s_both] data-[state=open]:animate-[fade-in_.25s_both]" />
        <Dialog.Content
          className={cn(
            "fixed z-[90] flex flex-col overflow-hidden border border-line bg-bg shadow-[0_30px_80px_-30px_var(--shadow)] outline-none",
            PANEL[variant],
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {media}
            <div className="sticky top-0 z-10 flex items-start gap-4 bg-bg/90 px-5 pt-5 pb-3 backdrop-blur-md sm:px-6">
              <div className="min-w-0 flex-1">
                <Dialog.Title className="m-0 text-2xl font-bold tracking-[-.03em]">{title}</Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-[15px] text-muted">
                    {description}
                  </Dialog.Description>
                ) : (
                  <Dialog.Description className="sr-only">{title}</Dialog.Description>
                )}
              </div>
              <Dialog.Close
                aria-label={closeLabel}
                className="grid size-10 flex-none place-items-center rounded-full border border-line bg-bg transition-colors hover:bg-faint"
              >
                <X className="size-[18px]" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="px-5 pb-5 sm:px-6">{children}</div>
          </div>
          {footer ? (
            <div className="border-t border-line bg-bg px-5 pt-4 pb-[calc(16px+env(safe-area-inset-bottom,0px))] sm:px-6">
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
