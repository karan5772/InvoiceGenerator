import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader, TricolorBar } from "@/components/site-header";

export const metadata: Metadata = {
  title: "GST, TDS & Invoicing Rules for Indian Freelancers",
  description:
    "What Indian law actually requires on a freelancer's invoice: GST registration thresholds, Rule 46 fields, TDS under Section 194J, exports under LUT, and what's optional. Cited to CBIC, the GST Council and the GST portal.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "GST, TDS & Invoicing Rules for Indian Freelancers",
    description:
      "What Indian law actually requires on a freelancer's invoice, cited to primary sources.",
    url: "/research",
    type: "article",
  },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const STATUS_BADGES: { pattern: RegExp; className: string }[] = [
  {
    pattern: /^compulsory/i,
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
  {
    pattern: /^conditional/i,
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  {
    pattern: /^optional/i,
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  {
    pattern: /^not applicable/i,
    className: "bg-surface-secondary text-text-secondary",
  },
  {
    pattern: /^fact$/i,
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  {
    pattern: /^(standard rule|must not contain)/i,
    className: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
];

function Strong({ children }: { children?: ReactNode }) {
  const text = textOf(children);
  const badge = STATUS_BADGES.find((b) => b.pattern.test(text));
  if (badge) {
    return (
      <strong
        className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold leading-snug ${badge.className}`}
      >
        {children}
      </strong>
    );
  }
  return <strong className="font-semibold text-text-primary">{children}</strong>;
}

export default function ResearchPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), "research.md"), "utf8");
  // The page renders its own title/intro header, so drop the markdown h1.
  const content = raw.replace(/^# .+\n/, "");
  const sections = [...content.matchAll(/^## (.+)$/gm)].map((m) =>
    m[1].replace(/\*\*/g, ""),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <TricolorBar />

      <SiteHeader
        secondaryActions={
          <a
            href="/research.md"
            className="hidden h-8 items-center rounded-md border border-border-subtle px-3 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary sm:inline-flex"
          >
            View raw markdown
          </a>
        }
      />

      <main className="mx-auto w-full max-w-[780px] flex-1 px-4 py-12 sm:px-6 sm:py-16">
        {/* Title */}
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
          Indian Freelancer Invoicing — Tax &amp; Legal Research
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          The rules this invoice generator is built on — GST registration and Rule 46
          invoice fields, TDS, presumptive taxation, exports under LUT, and what&apos;s
          actually mandatory versus best practice. Cited to primary sources wherever
          possible.
        </p>
        <p className="mt-4 text-xs text-text-tertiary">
          Compiled July 2026 · Primary sources: CBIC, GST Council, GST Portal · Not tax
          advice; verify with a CA
        </p>

        {/* Table of contents */}
        <nav
          aria-label="On this page"
          className="mt-10 rounded-xl border border-border-subtle bg-surface p-5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
            On this page
          </p>
          <ol className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s}>
                <a
                  href={`#${slugify(s)}`}
                  className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                >
                  {s}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Article */}
        <article className="research-article mt-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = textOf(children);
                return (
                  <h2
                    id={slugify(text)}
                    className="mt-14 scroll-mt-20 border-t border-border-subtle pt-10 text-xl font-semibold tracking-tight text-text-primary"
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="mt-8 text-[15px] font-semibold text-text-primary">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text-secondary">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-secondary">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="relative pl-5 [ol_&]:pl-0 before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-border-default [ol_&]:before:hidden">
                  {children}
                </li>
              ),
              strong: Strong,
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  {...props}
                  className="font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
                  {...(href?.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mt-6 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-4 py-1 text-sm [&_p]:text-text-secondary">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="mt-6 overflow-x-auto rounded-xl border border-border-subtle shadow-sm">
                  <table className="w-full border-collapse text-left text-[13px]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-surface-secondary text-[11px] uppercase tracking-wide text-text-tertiary">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2.5 font-semibold">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border-t border-border-subtle px-4 py-3 align-top leading-relaxed text-text-secondary">
                  {children}
                </td>
              ),
              hr: () => null,
              code: ({ children }) => (
                <code className="rounded bg-surface-secondary px-1.5 py-0.5 font-mono text-[12px] text-text-primary">
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-text-primary">
            Now put it to work
          </p>
          <p className="max-w-sm text-[13px] text-text-secondary">
            The generator applies all of this automatically — GST treatment, LUT
            declarations, TDS notes and the right invoice fields for your situation.
          </p>
          <Link
            href="/invoice"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90"
          >
            Create your invoice
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path
                d="M2.5 7.5h10m0 0L8 3m4.5 4.5L8 12"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-1.5 px-4 py-6 sm:px-6">
          <p className="text-[11px] text-text-tertiary">
            Made in India, for Indian freelancers · Free forever
          </p>
          <p className="text-[11px] text-text-tertiary">
            Built by{" "}
            <a
              href="https://karanchoudhary.dev?ref=invoice-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-secondary"
            >
              Karan Choudhary
            </a>
            , available for freelance web projects
          </p>
        </div>
      </footer>
    </div>
  );
}
