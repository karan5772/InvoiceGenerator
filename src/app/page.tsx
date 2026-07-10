"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { toPng } from "html-to-image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card";
import { BusinessDetailsForm } from "@/components/form/business-details-form";
import { ClientDetailsForm } from "@/components/form/client-details-form";
import { MetaForm } from "@/components/form/meta-form";
import { ItemsForm } from "@/components/form/items-form";
import { TaxSettingsForm } from "@/components/form/tax-settings-form";
import { NotesForm } from "@/components/form/notes-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { InvoicePdfDocument, preloadInvoicePdfFonts } from "@/components/invoice-pdf";
import { nextInvoiceNumber, usePersistedState } from "@/lib/storage";
import { addDaysISO, createSampleInvoice, todayISO } from "@/lib/sample-data";
import { InvoiceState, makeEmptyItem } from "@/lib/types";
import { computeTax, lineItemAmount } from "@/lib/calculations";

const STORAGE_KEY = "invoice-generator:v1";
const LG_BREAKPOINT = 1024;
const VIEWPORT_OFFSET = 128; // header + sticky top offset + bottom breathing room

function useFitToViewport(contentRef: React.RefObject<HTMLDivElement | null>, deps: unknown[]) {
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useEffect(() => {
    function recalc() {
      const el = contentRef.current;
      if (!el) return;
      if (window.innerWidth < LG_BREAKPOINT) {
        setScale(1);
        setNaturalHeight(0);
        return;
      }
      const natural = el.scrollHeight;
      const available = window.innerHeight - VIEWPORT_OFFSET;
      setNaturalHeight(natural);
      setScale(natural > 0 && available > 0 ? Math.min(1, available / natural) : 1);
    }

    recalc();
    const ro = new ResizeObserver(recalc);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { scale, naturalHeight };
}

function blankInvoice(): InvoiceState {
  const sample = createSampleInvoice();
  return {
    ...sample,
    profile: { ...sample.profile, name: "", tagline: "", email: "", phone: "", address: "", pan: "", gstin: "", udyam: "", logo: "", signature: "" },
    client: { ...sample.client, name: "", email: "", address: "", gstin: "" },
    items: [makeEmptyItem()],
    meta: { ...sample.meta, notes: "" },
  };
}

export default function Home() {
  const [invoice, setInvoice, hydrated] = usePersistedState<InvoiceState>(
    STORAGE_KEY,
    createSampleInvoice(),
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const tax = useMemo(
    () => computeTax(invoice.items, invoice.meta.gstTreatment),
    [invoice.items, invoice.meta.gstTreatment],
  );

  const previewContentRef = useRef<HTMLDivElement>(null);
  const { scale, naturalHeight } = useFitToViewport(previewContentRef, [invoice]);

  const [activeSection, setActiveSection] = useState<number | null>(1);
  function toggleSection(section: number) {
    setActiveSection((prev) => (prev === section ? null : section));
  }

  const completion = useMemo(() => {
    const yourDetails = Boolean(invoice.profile.name.trim() && invoice.profile.email.trim());
    const clientDetails = Boolean(invoice.client.name.trim());
    const invoiceMeta = Boolean(invoice.meta.number.trim() && invoice.meta.date);
    const lineItems =
      invoice.items.length > 0 &&
      invoice.items.every((item) => item.description.trim().length > 0) &&
      invoice.items.some((item) => lineItemAmount(item) > 0);
    return { yourDetails, clientDetails, invoiceMeta, lineItems };
  }, [invoice]);

  useEffect(() => {
    if (hydrated && !invoice.profile.name) {
      // Re-open and focus section 1 after hydration reveals an empty profile
      // (fresh load or just cleared) — a one-time reaction to external state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(1);
      document.getElementById("business-name-input")?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function patchProfile(patch: Partial<InvoiceState["profile"]>) {
    setInvoice((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }
  function patchClient(patch: Partial<InvoiceState["client"]>) {
    setInvoice((prev) => ({ ...prev, client: { ...prev.client, ...patch } }));
  }
  function patchMeta(patch: Partial<InvoiceState["meta"]>) {
    setInvoice((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }));
  }
  function setItems(items: InvoiceState["items"]) {
    setInvoice((prev) => ({ ...prev, items }));
  }

  function handleClear() {
    setInvoice(blankInvoice());
    setShowClearConfirm(false);
  }

  function handleNewInvoice() {
    setInvoice((prev) => ({
      ...prev,
      client: { ...prev.client, name: "", email: "", address: "", gstin: "" },
      items: [makeEmptyItem()],
      meta: {
        ...prev.meta,
        number: nextInvoiceNumber(prev.meta.number),
        date: todayISO(),
        dueDate: addDaysISO(15),
        notes: "",
      },
    }));
  }

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await preloadInvoicePdfFonts();
      const blob = await pdf(<InvoicePdfDocument invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.meta.number.trim() || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleDownloadImage() {
    setIsDownloadingImage(true);
    try {
      const node = exportRef.current?.querySelector<HTMLElement>("#invoice-preview-root");
      if (!node) return;
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${invoice.meta.number.trim() || "invoice"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setIsDownloadingImage(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border-subtle bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
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
            <span className="hidden rounded-full border border-border-default px-2 py-0.5 text-[11px] font-medium text-text-tertiary sm:inline">
              for Indian freelancers
            </span>
          </div>
          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden text-text-tertiary sm:inline">Clear everything?</span>
                <Button size="sm" variant="ghost" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="secondary" onClick={handleClear}>
                  Confirm
                </Button>
              </div>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={handleNewInvoice}>
                  New invoice
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowClearConfirm(true)}>
                  Clear
                </Button>
              </>
            )}
            <ThemeToggle />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadImage}
              disabled={isDownloadingImage}
              title="Download as PNG image"
            >
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                <path
                  d="M2.5 2.5h10v10h-10z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 9.5l2.8-2.8a1 1 0 0 1 1.4 0l1.3 1.3M8.5 6.5l.9-.9a1 1 0 0 1 1.4 0l1.7 1.7"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="5.5" cy="5.2" r="0.8" fill="currentColor" stroke="none" />
              </svg>
              {isDownloadingImage ? "Generating…" : "Download Image"}
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 2v7.5m0 0L4.5 6.5m3 3l3-3M2.5 11.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isDownloading ? "Generating…" : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:py-8">
        <div className="flex flex-col gap-4">
          <CardSection
            step={1}
            complete={completion.yourDetails}
            title="Your details"
            description="Appears as the invoice issuer"
            open={activeSection === 1}
            onToggle={() => toggleSection(1)}
          >
            <BusinessDetailsForm profile={invoice.profile} onChange={patchProfile} />
          </CardSection>

          <CardSection
            step={2}
            complete={completion.clientDetails}
            title="Client details"
            description="Who you're billing"
            open={activeSection === 2}
            onToggle={() => toggleSection(2)}
          >
            <ClientDetailsForm client={invoice.client} onChange={patchClient} />
          </CardSection>

          <CardSection
            step={3}
            complete={completion.invoiceMeta}
            title="Invoice details"
            description="Number, dates & currency"
            open={activeSection === 3}
            onToggle={() => toggleSection(3)}
          >
            <MetaForm meta={invoice.meta} onChange={patchMeta} />
          </CardSection>

          <CardSection
            step={4}
            complete={completion.lineItems}
            title="Line items"
            description="What you're billing for"
            open={activeSection === 4}
            onToggle={() => toggleSection(4)}
          >
            <ItemsForm
              items={invoice.items}
              currency={invoice.meta.currency}
              showHsn={invoice.meta.gstTreatment !== "unregistered"}
              onChange={setItems}
            />
          </CardSection>

          <CardSection
            step={5}
            title="Tax & compliance"
            description="GST treatment and TDS reference"
            open={activeSection === 5}
            onToggle={() => toggleSection(5)}
          >
            <TaxSettingsForm
              profile={invoice.profile}
              client={invoice.client}
              meta={invoice.meta}
              onChange={patchMeta}
            />
          </CardSection>

          <CardSection
            step={6}
            title="Notes & terms"
            description="Optional"
            open={activeSection === 6}
            onToggle={() => toggleSection(6)}
          >
            <NotesForm meta={invoice.meta} onChange={patchMeta} />
          </CardSection>

          <p className="px-1 pb-4 text-center text-[11px] text-text-tertiary">
            Everything is saved only in your browser — nothing is uploaded anywhere.
            {" "}
            <a
              href="/research.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-secondary"
            >
              Read the tax & compliance research
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
          <div
            id="invoice-preview-scale-wrap"
            className="lg:flex lg:justify-center"
            style={
              scale < 1
                ? { height: naturalHeight * scale, overflow: "hidden" }
                : undefined
            }
          >
            <div
              ref={previewContentRef}
              style={
                scale < 1
                  ? { transform: `scale(${scale})`, transformOrigin: "top center" }
                  : undefined
              }
            >
              <InvoicePreview invoice={invoice} />
            </div>
          </div>
          {tax.treatment !== "unregistered" && (
            <p className="shrink-0 px-1 text-center text-[11px] text-text-tertiary">
              GST calculated at 18% — verify the current rate for your service category
              before filing.
            </p>
          )}
        </div>
      </main>

      {/* Always full-size, untransformed copy for image export — kept off-screen
          so the on-screen scale-to-fit transform never affects the exported PNG. */}
      <div
        ref={exportRef}
        style={{ position: "fixed", top: 0, left: "-99999px", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <InvoicePreview invoice={invoice} />
      </div>

      {!hydrated && (
        <div className="pointer-events-none fixed inset-0 z-50 bg-background" />
      )}
    </div>
  );
}
