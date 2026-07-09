"use client";

import { Field, Textarea } from "@/components/ui/field";
import { InvoiceMeta } from "@/lib/types";

interface Props {
  meta: InvoiceMeta;
  onChange: (patch: Partial<InvoiceMeta>) => void;
}

export function NotesForm({ meta, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Notes" hint="Visible to the client, e.g. a thank-you note">
        <Textarea
          rows={2}
          value={meta.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </Field>
      <Field label="Payment terms">
        <Textarea
          rows={2}
          value={meta.terms}
          onChange={(e) => onChange({ terms: e.target.value })}
        />
      </Field>
    </div>
  );
}
