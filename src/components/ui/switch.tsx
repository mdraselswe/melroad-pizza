"use client";

import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelledBy?: string;
  label?: string;
  id?: string;
}

export function Switch({ checked, onChange, labelledBy, label, id }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-[50px] flex-none rounded-full p-0 shadow-[inset_0_0_0_1px_var(--glass-border)] transition-colors",
        checked ? "ember-fill" : "bg-faint",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] size-[22px] rounded-full bg-bg shadow-[0_2px_6px_var(--shadow)] transition-transform duration-300 ease-[var(--ease-spring)]",
          checked && "translate-x-[22px]",
        )}
      />
    </button>
  );
}
