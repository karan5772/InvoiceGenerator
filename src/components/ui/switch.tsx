"use client";

import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <label
      className={cn(
        "flex items-start justify-between gap-4",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
    >
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
          {description && (
            <span className="text-xs text-text-tertiary">{description}</span>
          )}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-foreground" : "bg-border-default",
        )}
      >
        <span
          className={cn(
            "inline-block size-3.5 transform rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-1",
          )}
        />
      </button>
    </label>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "accent" }) {
  const tones = {
    neutral: "bg-surface-secondary text-text-secondary border-border-default",
    success: "bg-success-bg text-success border-transparent",
    accent: "bg-accent/10 text-accent border-transparent",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
