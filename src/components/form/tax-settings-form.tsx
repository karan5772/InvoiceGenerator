"use client";

import { Badge } from "@/components/ui/switch";
import { Switch } from "@/components/ui/switch";
import { Field, Input, Select } from "@/components/ui/field";
import { BusinessProfile, ClientDetails, GstTreatment, InvoiceMeta } from "@/lib/types";

interface Props {
  profile: BusinessProfile;
  client: ClientDetails;
  meta: InvoiceMeta;
  onChange: (patch: Partial<InvoiceMeta>) => void;
}

function suggestTreatment(profile: BusinessProfile, client: ClientDetails): GstTreatment {
  if (!profile.gstin.trim()) return "unregistered";
  if (client.country !== "India") return "export_lut";
  if (client.state === profile.state) return "intra_state";
  return "inter_state";
}

const TREATMENT_LABEL: Record<GstTreatment, string> = {
  unregistered: "Not registered under GST",
  intra_state: "GST — CGST + SGST (same state)",
  inter_state: "GST — IGST (different state)",
  export_lut: "Export of services — zero-rated under LUT",
};

export function TaxSettingsForm({ profile, client, meta, onChange }: Props) {
  const hasGstin = profile.gstin.trim().length > 0;
  const suggested = suggestTreatment(profile, client);
  const mismatched = hasGstin && suggested !== meta.gstTreatment;

  return (
    <div className="flex flex-col gap-4">
      {!hasGstin && (
        <div className="rounded-lg border border-border-subtle bg-surface-secondary px-3 py-2.5 text-xs text-text-secondary">
          No GSTIN on file — this invoice will not charge GST. GST registration is
          mandatory only once your aggregate turnover crosses ₹20 lakh (₹10 lakh in
          special category states) in a financial year, or if you make any inter-state
          taxable supply. Add your GSTIN in{" "}
          <span className="font-medium text-text-primary">Your details</span> to enable
          GST invoicing.
        </div>
      )}

      <Field label="GST treatment" hint="Determines whether CGST/SGST, IGST, or no tax is applied">
        <Select
          value={meta.gstTreatment}
          disabled={!hasGstin}
          onChange={(e) => onChange({ gstTreatment: e.target.value as GstTreatment })}
        >
          {!hasGstin && <option value="unregistered">{TREATMENT_LABEL.unregistered}</option>}
          {hasGstin && (
            <>
              <option value="intra_state">{TREATMENT_LABEL.intra_state}</option>
              <option value="inter_state">{TREATMENT_LABEL.inter_state}</option>
              <option value="export_lut">{TREATMENT_LABEL.export_lut}</option>
            </>
          )}
        </Select>
      </Field>

      {mismatched && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-text-secondary">
          <span>
            Based on the client&apos;s country/state, this looks like it should be{" "}
            <span className="font-medium text-text-primary">{TREATMENT_LABEL[suggested]}</span>.
          </span>
          <button
            type="button"
            onClick={() => onChange({ gstTreatment: suggested })}
            className="shrink-0 font-medium text-accent hover:underline"
          >
            Use this
          </button>
        </div>
      )}

      {meta.gstTreatment === "export_lut" && (
        <div className="rounded-lg border border-border-subtle bg-surface-secondary px-3 py-2.5 text-xs text-text-secondary">
          <Badge tone="accent">LUT</Badge>
          <span className="ml-2">
            Zero-rated export requires an active Letter of Undertaking (LUT) filed on the
            GST portal (Form GST RFD-11). The invoice will carry the declaration:
            &ldquo;Supply meant for export under LUT without payment of integrated
            tax.&rdquo; Keep the FIRC / bank remittance advice for each payment received.
          </span>
        </div>
      )}

      <div className="border-t border-border-subtle pt-4">
        <Switch
          checked={meta.showTdsNote}
          onChange={(checked) => onChange({ showTdsNote: checked })}
          label="Show estimated TDS note"
          description="Informational only — TDS is deducted by the client, not subtracted from your invoice total"
        />
        {meta.showTdsNote && (
          <div className="mt-3 grid grid-cols-2 gap-4">
            <Field label="Section">
              <Select
                value={meta.tdsSection}
                onChange={(e) => {
                  const section = e.target.value as InvoiceMeta["tdsSection"];
                  const rateMap: Record<InvoiceMeta["tdsSection"], number> = {
                    "194J": 10,
                    "194C": 1,
                    "194H": 5,
                    custom: meta.tdsRate,
                  };
                  onChange({ tdsSection: section, tdsRate: rateMap[section] });
                }}
              >
                <option value="194J">194J — Professional/technical fees</option>
                <option value="194C">194C — Contract work</option>
                <option value="194H">194H — Commission/brokerage</option>
                <option value="custom">Custom</option>
              </Select>
            </Field>
            <Field label="Rate (%)">
              <Input
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={meta.tdsRate}
                onChange={(e) => onChange({ tdsRate: Number(e.target.value) })}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
