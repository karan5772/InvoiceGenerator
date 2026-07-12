"use client";

import { useState } from "react";
import Link from "next/link";
import { GitHubIcon, SiteHeader, TricolorBar } from "@/components/site-header";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

function StarIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
      <path d="M7.5.9l2.05 4.16 4.59.66-3.32 3.24.78 4.57L7.5 11.37l-4.1 2.15.78-4.57L.86 5.72l4.59-.66L7.5.9Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M3 7.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FEATURES = [
  {
    icon: "%",
    tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "GST, handled for you",
    body: "Pick your state and the client's. CGST + SGST or IGST is applied automatically at 18%, with GSTIN and SAC fields where Rule 46 expects them.",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M5 7.5l1.8 1.8L10.5 5.8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "No GSTIN? No problem",
    body: "Below the ₹20 lakh threshold you don't need GST registration, and this tool doesn't pretend you do. Clean PAN-based invoices with no tax clutter.",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 7.5h12" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M7.5 1.5c2.2 1.9 2.2 10.1 0 12c-2.2-1.9-2.2-10.1 0-12Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
    tint: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    title: "Billing foreign clients",
    body: "Export of services under LUT, zero-rated with the exact declaration text on the invoice. Foreign currencies and SWIFT details for wire transfers.",
  },
  {
    icon: "₹",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    title: "Know your TDS",
    body: "An optional note shows what your client may deduct under Sec 194J and what actually lands in your bank, so the payout never surprises you.",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M4 1.5h4.5l3 3v9H4v-12Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M8.5 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6 8h3.5M6 10.5h3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
    tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    title: "Real, professional PDFs",
    body: "Vector PDFs with selectable text, so clients can copy your account number straight off the invoice. PNG export included for quick WhatsApp sends.",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="3" y="6.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    tint: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    title: "Private by design",
    body: "No sign-up, no server, no tracking. Everything is saved in your own browser and never leaves your device.",
  },
];

const AUDIENCES = [
  {
    tag: "Freshers",
    tagTint: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    checkTint: "text-amber-600 dark:text-amber-400",
    title: "Just starting out",
    points: [
      "Send your first invoice without knowing what a SAC code is",
      "PAN-only invoices, no GST registration needed",
      "Amount in words, lakh/crore formatting, ₹ done right",
    ],
  },
  {
    tag: "GST registered",
    tagTint: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    checkTint: "text-emerald-600 dark:text-emerald-400",
    title: "Company or sole proprietor",
    points: [
      "All mandatory Rule 46 tax-invoice fields",
      "CGST/SGST vs IGST picked from place of supply",
      "Unique invoice numbering per financial year",
    ],
  },
  {
    tag: "Exporters",
    tagTint: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    checkTint: "text-blue-600 dark:text-blue-400",
    title: "Working with foreign clients",
    points: [
      "Zero-rated export under LUT with the right declaration",
      "Invoice in USD, EUR, GBP and more",
      "SWIFT code and bank details laid out for easy copying",
    ],
  },
];

const REVIEWS = [
  {
    quote:
      "Sent my first-ever invoice with this. I didn't even know what a SAC code was, and it quietly filled the gaps for me.",
    name: "Ananya",
    role: "UI designer · Bengaluru",
  },
  {
    quote:
      "The CGST/SGST vs IGST split used to confuse me every single time. Now I pick the client's state and it just does it.",
    name: "Rohit",
    role: "Web developer · Jaipur",
  },
  {
    quote:
      "I'm not GST-registered yet, and every other tool kept forcing tax fields on me. This one actually understands that.",
    name: "Sneha",
    role: "Content writer · Indore",
  },
  {
    quote:
      "Export under LUT with the correct declaration printed on the invoice. My CA had nothing to correct.",
    name: "Arjun",
    role: "Consultant · Pune",
  },
  {
    quote:
      "No sign-up, no watermark, and the PDF text is selectable. My client copied the account number straight from it.",
    name: "Meera",
    role: "Illustrator · Kochi",
  },
  {
    quote:
      "Every junior on my team who starts freelancing gets this link from me on day one.",
    name: "Vikram",
    role: "Agency owner · Delhi",
  },
];

const FAQS = [
  {
    q: "Is this invoice generator really free?",
    a: "Yes. Every feature is free: GST invoices, PDF and PNG downloads, exports under LUT, TDS notes. There is no sign-up, no watermark, and no premium tier, and the project is open source.",
  },
  {
    q: "Can I create an invoice without a GSTIN?",
    a: "Yes. If your turnover is below the ₹20 lakh GST threshold (₹10 lakh in special category states), you don't need GST registration. Pick 'Not registered under GST' and the invoice stays a clean, PAN-based document with no tax fields.",
  },
  {
    q: "Does it make GST-compliant tax invoices?",
    a: "Yes. Registered freelancers get the mandatory Rule 46 fields: GSTIN, SAC codes, place of supply, and an automatic CGST + SGST or IGST split at 18% based on your state and the client's.",
  },
  {
    q: "Can I invoice foreign clients from India?",
    a: "Yes. Choose export under LUT and the invoice is zero-rated with the exact declaration text, in USD, EUR, GBP and other currencies, with SWIFT details for wire transfers.",
  },
  {
    q: "Where is my invoice data stored?",
    a: "In your browser only. There is no server and no account; your details and invoices never leave your device.",
  },
  {
    q: "What is TDS and why is my payment smaller than the invoice?",
    a: "Clients often deduct tax at source under Section 194J (typically 10% for professional services) before paying you. The generator can show an estimated TDS note on the invoice so the final payout doesn't surprise you.",
  },
];

const AVATAR_TINTS = [
  "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  "bg-teal-500/15 text-teal-600 dark:text-teal-400",
];

function InvoiceMock() {
  return (
    <div
      className="mx-auto w-full max-w-[380px] rounded-xl bg-white text-[#111] shadow-lg lg:rotate-[1.5deg]"
      style={{ colorScheme: "light" }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-sm font-bold tracking-tight">INVOICE</p>
            <p className="mt-0.5 font-mono text-[10px] text-[#888]">INV-0042</p>
          </div>
          <div className="text-right text-[10px] text-[#888]">
            <p>
              Date <span className="font-medium text-[#111]">12 Jul 2026</span>
            </p>
            <p>
              Due <span className="font-medium text-[#111]">27 Jul 2026</span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-between text-[10px]">
          <div>
            <p className="font-semibold uppercase tracking-wide text-[#aaa]">Billed by</p>
            <p className="mt-1 text-xs font-semibold text-[#111]">Priya Sharma</p>
            <p className="text-[#777]">Product Designer · Karnataka</p>
          </div>
          <div className="text-right">
            <p className="font-semibold uppercase tracking-wide text-[#aaa]">Billed to</p>
            <p className="mt-1 text-xs font-semibold text-[#111]">Acme Studio LLP</p>
            <p className="text-[#777]">Bengaluru, Karnataka</p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#eee] pt-3 text-[11px]">
          <div className="flex justify-between py-1.5">
            <span className="text-[#333]">Brand identity design</span>
            <span className="font-mono">₹40,000.00</span>
          </div>
          <div className="flex justify-between border-t border-[#f2f2f2] py-1.5">
            <span className="text-[#333]">Landing page — design &amp; build</span>
            <span className="font-mono">₹25,000.00</span>
          </div>
        </div>

        <div className="mt-3 space-y-1 border-t border-[#eee] pt-3 text-[11px]">
          <div className="flex justify-between text-[#777]">
            <span>Subtotal</span>
            <span className="font-mono">₹65,000.00</span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>CGST (9%)</span>
            <span className="font-mono">₹5,850.00</span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>SGST (9%)</span>
            <span className="font-mono">₹5,850.00</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-[#ddd] pt-2 text-[13px] font-bold">
            <span>Total</span>
            <span className="font-mono">₹76,700.00</span>
          </div>
        </div>

        <p className="mt-3 text-[9px] leading-relaxed text-[#999]">
          <span className="font-semibold text-[#555]">Amount in words:</span> Seventy Six
          Thousand Seven Hundred Rupees Only
        </p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  function copy(text: string, set: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      set(true);
      setTimeout(() => set(false), 2000);
    });
  }

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description:
      "Free, GST-aware invoice generator for Indian freelancers. GST and non-GST invoices, exports under LUT, TDS notes, and PDF/PNG downloads. No sign-up; data stays in the browser.",
    featureList: [
      "GST invoices with automatic CGST/SGST or IGST split",
      "PAN-based invoices without a GSTIN",
      "Export of services under LUT with zero-rated declaration",
      "TDS (Section 194J) estimate on the invoice",
      "Vector PDF and PNG downloads",
      "Amount in words with lakh/crore formatting",
    ],
    author: { "@type": "Person", name: SITE.developer, url: SITE.github },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TricolorBar />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border-subtle">
          <div className="hero-grid absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-[1100px] items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-5xl">
                Professional invoices for Indian freelancers.
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0">
                Whether you&apos;re GST-registered, running a company, or sending your
                very first invoice: create a compliant, professional invoice in
                minutes.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/invoice"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-90"
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
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-border-default bg-surface px-6 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                >
                  <span className="text-amber-500">
                    <StarIcon />
                  </span>
                  Star on GitHub
                </a>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-text-tertiary">
                Free and open source. No account, no watermark, and your data never
                leaves your browser.
              </p>
            </div>

            <InvoiceMock />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-border-subtle">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Everything an Indian freelancer needs
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
              Built around actual Indian tax rules: GST thresholds, Rule 46 invoice
              fields, TDS, and LUT exports. Not a generic template with a ₹ pasted on.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold",
                      f.tint,
                    )}
                  >
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{f.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                      {f.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="border-b border-border-subtle bg-surface-secondary/50">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Made for wherever you are in the journey
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {AUDIENCES.map((a) => (
                <div
                  key={a.title}
                  className="rounded-xl border border-border-subtle bg-surface p-6"
                >
                  <span
                    className={cn(
                      "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      a.tagTint,
                    )}
                  >
                    {a.tag}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-text-primary">{a.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {a.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-[13px] text-text-secondary"
                      >
                        <span className={cn("mt-0.5 shrink-0", a.checkTint)}>
                          <CheckIcon />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="border-b border-border-subtle">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              What freelancers say
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <figure
                  key={r.name}
                  className="flex flex-col justify-between rounded-xl border border-border-subtle bg-surface p-5"
                >
                  <blockquote className="text-[13px] leading-relaxed text-text-secondary">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                        AVATAR_TINTS[i % AVATAR_TINTS.length],
                      )}
                    >
                      {r.name[0]}
                    </span>
                    <span>
                      <span className="block text-xs font-semibold text-text-primary">
                        {r.name}
                      </span>
                      <span className="block text-[11px] text-text-tertiary">{r.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub — inverted panel */}
        <section className="border-b border-border-subtle">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <div className="rounded-2xl bg-foreground px-6 py-14 text-center text-background shadow-lg">
              <div className="mx-auto flex max-w-md flex-col items-center">
                <GitHubIcon size={32} />
                <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Free and open source
                </h2>
                <p className="mt-3 text-sm leading-relaxed opacity-70">
                  There is no premium tier and nothing locked behind a paywall. If this
                  tool helped you, star the repo on GitHub and share it with a
                  freelancer friend. That&apos;s how it reaches the people who need it.
                </p>
                <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-background px-5 text-sm font-medium text-foreground shadow-sm transition-opacity hover:opacity-90"
                  >
                    <span className="text-amber-500">
                      <StarIcon />
                    </span>
                    Star on GitHub
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(window.location.origin, setCopiedLink)}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-background/25 px-5 text-sm font-medium transition-colors hover:bg-background/10"
                  >
                    {copiedLink ? "Link copied!" : "Share with a friend"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support / Donate */}
        <section id="support" className="border-b border-border-subtle">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Keep it free for the next freelancer
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-6">
                <h3 className="text-base font-semibold text-text-primary">
                  Buy me a chai ☕
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  This tool costs nothing and always will. If it saved you an afternoon
                  of invoice confusion, a small UPI tip keeps the chai and the updates
                  flowing.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <code className="flex-1 truncate rounded-md border border-border-default bg-surface px-3 py-2 font-mono text-xs text-text-primary">
                    {SITE.upi}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(SITE.upi, setCopiedUpi)}
                    className="inline-flex h-9 shrink-0 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    {copiedUpi ? "Copied!" : "Copy UPI"}
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface p-6">
                <h3 className="text-base font-semibold text-text-primary">
                  Can&apos;t donate? That&apos;s fine
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  A GitHub star, a bug report, or forwarding this to one freelancer
                  who&apos;s still making invoices in Word: all of it genuinely helps,
                  and all of it is free.
                </p>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-border-default px-4 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                >
                  <GitHubIcon size={13} />
                  Open the repo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b border-border-subtle">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Common questions
            </h2>
            <div className="mt-8 max-w-2xl">
              {FAQS.map((f) => (
                <details key={f.q} className="group border-b border-border-subtle py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-text-primary [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="shrink-0 text-text-tertiary transition-transform group-open:rotate-180"
                    >
                      <path
                        d="M3.5 5.5l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-text-secondary">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* About the developer */}
        <section id="about">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-600 text-xl font-semibold text-white">
                {SITE.developer[0]}
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Hi, I&apos;m {SITE.developer}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                I&apos;m a freelance software developer from India. My first invoice
                took longer to figure out than the work it billed: what a SAC code was,
                whether I needed GST, why TDS made the payment smaller. This is the
                tool I wish someone had handed me on day one. No accounts, no tracking,
                no paywall.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border-default px-4 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                >
                  <GitHubIcon size={13} />
                  GitHub
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border-default px-4 text-xs font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                >
                  <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                    <rect
                      x="1.5"
                      y="3"
                      width="12"
                      height="9"
                      rx="1"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                    <path
                      d="M2 4l5.5 4L13 4"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Email me
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center gap-3 px-4 py-8 text-center sm:px-6">
          <TricolorBar className="w-16 rounded-full" />
          <p className="max-w-lg text-[11px] leading-relaxed text-text-tertiary">
            This tool is not tax advice. Rates and thresholds change with each Budget,
            so verify with a CA before filing.{" "}
            <a href="/research" className="underline hover:text-text-secondary">
              Read the tax &amp; compliance research
            </a>{" "}
            behind this tool.
          </p>
          <p className="text-[11px] text-text-tertiary">
            Made in India, for Indian freelancers · Free forever
          </p>
        </div>
      </footer>
    </div>
  );
}
