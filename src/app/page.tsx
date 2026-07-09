"use client";

import { useMemo, useState } from "react";
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
import { usePersistedState } from "@/lib/storage";
import { createSampleInvoice } from "@/lib/sample-data";
import { InvoiceState, makeEmptyItem } from "@/lib/types";
import { computeTax } from "@/lib/calculations";

const STORAGE_KEY = "invoice-generator:v1";

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

  const tax = useMemo(
    () => computeTax(invoice.items, invoice.meta.gstTreatment),
    [invoice.items, invoice.meta.gstTreatment],
  );

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

  function handleDownload() {
    window.print();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-20 border-b border-border-subtle bg-background/80 backdrop-blur-md">
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
              <Button size="sm" variant="ghost" onClick={() => setShowClearConfirm(true)}>
                Clear
              </Button>
            )}
            <ThemeToggle />
            <Button size="sm" onClick={handleDownload}>
              <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                <path
                  d="M7.5 2v7.5m0 0L4.5 6.5m3 3l3-3M2.5 11.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="no-print mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:py-8">
        <div className="flex flex-col gap-4">
          <CardSection step={1} title="Your details" description="Appears as the invoice issuer">
            <BusinessDetailsForm profile={invoice.profile} onChange={patchProfile} />
          </CardSection>

          <CardSection step={2} title="Client details" description="Who you're billing">
            <ClientDetailsForm client={invoice.client} onChange={patchClient} />
          </CardSection>

          <CardSection step={3} title="Invoice details" description="Number, dates & currency">
            <MetaForm meta={invoice.meta} onChange={patchMeta} />
          </CardSection>

          <CardSection step={4} title="Line items" description="What you're billing for">
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
          >
            <TaxSettingsForm
              profile={invoice.profile}
              client={invoice.client}
              meta={invoice.meta}
              onChange={patchMeta}
            />
          </CardSection>

          <CardSection step={6} title="Notes & terms" description="Optional">
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

        <div className="flex flex-col gap-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start">
          <div
            id="invoice-preview-scale-wrap"
            className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
          >
            <InvoicePreview invoice={invoice} />
          </div>
          {tax.treatment !== "unregistered" && (
            <p className="shrink-0 px-1 text-center text-[11px] text-text-tertiary">
              GST calculated at 18% — verify the current rate for your service category
              before filing.
            </p>
          )}
        </div>
      </main>

      <div className="print-only">
        <InvoicePreview invoice={invoice} />
      </div>

      {!hydrated && (
        <div className="pointer-events-none fixed inset-0 z-50 bg-background" />
      )}
    </div>
  );
}
