import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Label + control + error message. The control should set `id`, `aria-invalid` and `aria-describedby={errorId(id)}`. */
export function Field({ id, label, error, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-[13.5px] font-semibold text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId(id)} role="alert" className="m-0 text-[13.5px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const errorId = (id: string) => `${id}-error`;
