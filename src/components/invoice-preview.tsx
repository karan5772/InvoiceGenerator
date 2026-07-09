"use client";

import {
  computeTax,
  estimateTds,
  formatCurrency,
  lineItemAmount,
  numberToWords,
  subtotal,
} from "@/lib/calculations";
import { InvoiceState } from "@/lib/types";

interface Props {
  invoice: InvoiceState;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InvoicePreview({ invoice }: Props) {
  const { profile, client, meta, items } = invoice;
  const tax = computeTax(items, meta.gstTreatment);
  const showHsn = meta.gstTreatment !== "unregistered";
  const isExport = meta.gstTreatment === "export_lut";
  const isForeignCurrency = meta.currency !== "INR";
  const tdsAmount = estimateTds(tax.taxable, meta.tdsRate);
  const netAfterTds = tax.grandTotal - tdsAmount;

  return (
    <div
      id="invoice-preview-root"
      className="mx-auto flex w-full max-w-[210mm] flex-col bg-white text-[#111] shadow-lg"
      style={{
        fontFeatureSettings: '"tnum"',
        colorScheme: "light",
        forcedColorAdjust: "none",
      }}
    >
      <div className="flex flex-col gap-8 p-8 sm:p-12">
        {/* Header */}
        <div className="border-b border-[#d6d6d6] pb-6">
          <h2 className="text-center font-mono text-2xl font-semibold tracking-tight text-[#111]">
            INVOICE
          </h2>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-3">
              {profile.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.logo}
                  alt=""
                  className="size-12 rounded-md object-cover"
                />
              )}
              <div>
                <h1 className="text-lg font-semibold text-[#111]">
                  {profile.name || "Your name"}
                </h1>
                {profile.tagline && (
                  <p className="mt-0.5 text-xs text-[#666]">{profile.tagline}</p>
                )}
                <div className="mt-2 space-y-0.5 text-xs text-[#666]">
                  {profile.address.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                {(profile.email || profile.phone) && (
                  <div className="mt-2 space-y-0.5 text-xs text-[#666]">
                    {profile.email && <p>{profile.email}</p>}
                    {profile.phone && <p>{profile.phone}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                Invoice details
              </p>
              <p className="mt-1.5 font-mono text-sm text-[#111]">
                Invoice No. {meta.number || "—"}
              </p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between gap-6">
                  <span className="text-[#999]">Date issued</span>
                  <span className="font-medium text-[#111]">
                    {formatDate(meta.date)}
                  </span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-[#999]">Due date</span>
                  <span className="font-medium text-[#111]">
                    {formatDate(meta.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
              Billed by
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#111]">
              {profile.name || "—"}
            </p>
            {profile.pan && (
              <p className="mt-1 text-xs text-[#666]">
                PAN <span className="font-mono">{profile.pan}</span>
              </p>
            )}
            {profile.gstin && (
              <p className="text-xs text-[#666]">
                GSTIN <span className="font-mono">{profile.gstin}</span>
              </p>
            )}
            {profile.udyam && (
              <p className="text-xs text-[#666]">
                Udyam <span className="font-mono">{profile.udyam}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-[#666]">{profile.state}, India</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
              Billed to
            </p>
            <p className="mt-1.5 text-sm font-medium text-[#111]">
              {client.name || "—"}
            </p>
            {client.gstin && (
              <p className="mt-1 text-xs text-[#666]">
                GSTIN <span className="font-mono">{client.gstin}</span>
              </p>
            )}
            <p className="mt-1 text-xs text-[#666]">
              {client.state ? `${client.state}, ` : ""}
              {client.country}
            </p>
            {client.email && (
              <p className="text-xs text-[#666]">{client.email}</p>
            )}
          </div>
        </div>

        {/* Items table */}
        <div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#bbb] text-left text-[11px] uppercase tracking-wide text-[#999]">
                <th className="py-2 font-medium">Description</th>
                {showHsn && (
                  <th className="py-2 pr-3 text-right font-medium">SAC</th>
                )}
                <th className="py-2 pr-3 text-right font-medium">Qty</th>
                <th className="py-2 pr-3 text-right font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#e2e2e2]">
                  <td className="whitespace-pre-line py-2.5 pr-3 align-top text-[#111]">
                    {item.description || "—"}
                  </td>
                  {showHsn && (
                    <td className="py-2.5 pr-3 text-right align-top font-mono text-xs text-[#666]">
                      {item.hsnSac || "—"}
                    </td>
                  )}
                  <td className="py-2.5 pr-3 text-right align-top text-[#666]">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 pr-3 text-right align-top font-mono text-[#666]">
                    {formatCurrency(item.rate, meta.currency)}
                  </td>
                  <td className="py-2.5 text-right align-top font-mono text-[#111]">
                    {formatCurrency(lineItemAmount(item), meta.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#666]">Subtotal</span>
              <span className="font-mono text-[#111]">
                {formatCurrency(subtotal(items), meta.currency)}
              </span>
            </div>
            {tax.treatment === "intra_state" && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#666]">CGST (9%)</span>
                  <span className="font-mono text-[#111]">
                    {formatCurrency(tax.cgst, meta.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">SGST (9%)</span>
                  <span className="font-mono text-[#111]">
                    {formatCurrency(tax.sgst, meta.currency)}
                  </span>
                </div>
              </>
            )}
            {tax.treatment === "inter_state" && (
              <div className="flex justify-between">
                <span className="text-[#666]">IGST (18%)</span>
                <span className="font-mono text-[#111]">
                  {formatCurrency(tax.igst, meta.currency)}
                </span>
              </div>
            )}
            {tax.treatment === "export_lut" && (
              <div className="flex justify-between">
                <span className="text-[#666]">GST</span>
                <span className="font-mono text-[#111]">Zero-rated (LUT)</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#bbb] pt-1.5 text-base font-semibold">
              <span className="text-[#111]">Total</span>
              <span className="font-mono text-[#111]">
                {formatCurrency(tax.grandTotal, meta.currency)}
              </span>
            </div>
            {meta.showTdsNote && tdsAmount > 0 && (
              <div className="mt-2 space-y-1 border-t border-dashed border-[#d6d6d6] pt-2 text-xs text-[#999]">
                <div className="flex justify-between">
                  <span>
                    Est. TDS (Sec {meta.tdsSection}, {meta.tdsRate}%)
                  </span>
                  <span className="font-mono">
                    -{formatCurrency(tdsAmount, meta.currency)}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-[#666]">
                  <span>Net receivable after TDS</span>
                  <span className="font-mono">
                    {formatCurrency(netAfterTds, meta.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isForeignCurrency && (
          <p className="-mt-4 text-xs text-[#666]">
            <span className="font-medium text-[#111]">Amount in words: </span>
            {numberToWords(tax.grandTotal, meta.currency)}
          </p>
        )}

        {isExport && (
          <p className="rounded-md border border-[#d6d6d6] bg-[#fafafa] px-3 py-2 text-[11px] leading-snug text-[#666]">
            Supply meant for export under Letter of Undertaking (LUT) without
            payment of integrated tax.
          </p>
        )}

        {/* Payment details */}
        {(profile.bank.accountNumber || profile.bank.upiId) && (
          <div className="grid grid-cols-2 gap-6 border-t border-[#d6d6d6] pt-5 text-xs">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                Payment details
              </p>
              <div className="mt-1.5 space-y-0.5 text-[#666]">
                {profile.bank.accountName && <p>{profile.bank.accountName}</p>}
                {profile.bank.bankName && <p>{profile.bank.bankName}</p>}
                {profile.bank.accountNumber && (
                  <p>
                    A/C{" "}
                    <span className="font-mono">
                      {profile.bank.accountNumber}
                    </span>
                  </p>
                )}
                {profile.bank.ifsc && (
                  <p>
                    IFSC <span className="font-mono">{profile.bank.ifsc}</span>
                  </p>
                )}
                {profile.bank.swiftCode && (
                  <p>
                    SWIFT{" "}
                    <span className="font-mono">{profile.bank.swiftCode}</span>
                  </p>
                )}
              </div>
            </div>
            {profile.bank.upiId && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                  UPI
                </p>
                <p className="mt-1.5 font-mono text-[#666]">
                  {profile.bank.upiId}
                </p>
              </div>
            )}
          </div>
        )}

        {(meta.notes || meta.terms) && (
          <div className="space-y-3 border-t border-[#d6d6d6] pt-5 text-xs text-[#666]">
            {meta.notes && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                  Notes
                </p>
                <p className="mt-1">{meta.notes}</p>
              </div>
            )}
            {meta.terms && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#999]">
                  Terms
                </p>
                <p className="mt-1">{meta.terms}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-8">
          <div className="flex w-40 flex-col items-center text-center text-xs text-[#666]">
            {profile.signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.signature}
                alt="Signature"
                className="h-14 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <div className="h-10 w-40" />
            )}
            <div className="mt-1 w-full border-b border-[#ccc]" />
            <p className="mt-1.5">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
