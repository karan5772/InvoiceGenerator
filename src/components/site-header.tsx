"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

const SAFFRON = "#ff671f";
const INDIA_GREEN = "#046a38";

const NAV = [
  { label: "Features", href: "/#features" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Research", href: "/research" },
  { label: "Support", href: "/#support" },
  { label: "About", href: "/#about" },
];

export function TricolorBar({
  className,
  height = 2,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      className={cn("w-full", className)}
      style={{
        height,
        background: `linear-gradient(90deg, ${SAFFRON} 0%, ${SAFFRON} 28%, transparent 42%, transparent 58%, ${INDIA_GREEN} 72%, ${INDIA_GREEN} 100%)`,
      }}
    />
  );
}

export function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

interface SiteHeaderProps {
  /** Use the app's wider 1400px container (invoice generator) instead of 1100px. */
  wide?: boolean;
  /** Ghost/utility controls rendered before the GitHub + theme buttons. */
  secondaryActions?: ReactNode;
  /** Primary controls at the far right; defaults to the "Create invoice" CTA. */
  primaryActions?: ReactNode;
}

export function SiteHeader({ wide = false, secondaryActions, primaryActions }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div
        className={cn(
          "mx-auto flex h-14 w-full items-center gap-8 px-4 sm:px-6",
          wide ? "max-w-[1400px]" : "max-w-[1100px]",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background">
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <path
                d="M3 2h9v11l-2.5-1.5L7 13l-2.5-1.5L3 13V2Z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold">Invoice</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = !item.href.includes("#") && pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "text-[13px] transition-colors",
                  active
                    ? "font-medium text-text-primary"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {secondaryActions}
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center gap-1.5 rounded-md border border-border-subtle px-2.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary sm:flex"
          >
            <GitHubIcon size={13} />
            <span className="hidden md:inline">GitHub</span>
          </a>
          <ThemeToggle />
          {primaryActions ?? (
            <Link
              href="/invoice"
              className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background shadow-sm transition-opacity hover:opacity-90"
            >
              Create invoice
            </Link>
          )}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-8 items-center justify-center rounded-md border border-border-subtle text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary lg:hidden"
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3.5 3.5l8 8m0-8l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path
                  d="M2 4.5h11M2 7.5h11M2 10.5h11"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border-subtle bg-background lg:hidden">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border-subtle py-3 text-sm text-text-secondary transition-colors last:border-b-0 hover:text-text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
