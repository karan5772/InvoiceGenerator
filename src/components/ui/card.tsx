import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle bg-surface shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

interface CardSectionProps {
  title: string;
  description?: string;
  step?: number;
  complete?: boolean;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
}

export function CardSection({
  title,
  description,
  step,
  complete,
  children,
  open,
  onToggle,
}: CardSectionProps) {
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-secondary",
          open && "border-b border-border-subtle",
        )}
      >
        <div className="flex items-start gap-3">
          {step !== undefined && (
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-colors",
                complete
                  ? "bg-success-bg text-success"
                  : "bg-surface-secondary text-text-secondary",
              )}
            >
              {complete ? (
                <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M3 7.5l3 3 6-6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step
              )}
            </span>
          )}
          <div>
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>
            )}
          </div>
        </div>
        <svg
          width="13"
          height="13"
          viewBox="0 0 15 15"
          fill="none"
          className={cn(
            "mt-1 shrink-0 text-text-tertiary transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path
            d="M3.5 5.5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-5">{children}</div>
        </div>
      </div>
    </Card>
  );
}
