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
  right?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CardSection({ title, description, step, right, children }: CardSectionProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <div className="flex items-start gap-3">
          {step !== undefined && (
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-[11px] font-medium text-text-secondary">
              {step}
            </span>
          )}
          <div>
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>
            )}
          </div>
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}
