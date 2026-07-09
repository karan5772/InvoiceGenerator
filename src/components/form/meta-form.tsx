"use client";

import { Field, Input, Select } from "@/components/ui/field";
import { CURRENCIES, InvoiceMeta } from "@/lib/types";

interface Props {
  meta: InvoiceMeta;
  onChange: (patch: Partial<InvoiceMeta>) => void;
}

export function MetaForm({ meta, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Invoice number" required>
        <Input
          value={meta.number}
          onChange={(e) => onChange({ number: e.target.value })}
          className="font-mono"
        />
      </Field>
      <Field label="Currency">
        <Select value={meta.currency} onChange={(e) => onChange({ currency: e.target.value as InvoiceMeta["currency"] })}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Invoice date" required>
        <Input
          type="date"
          value={meta.date}
          onChange={(e) => onChange({ date: e.target.value })}
        />
      </Field>
      <Field label="Due date">
        <Input
          type="date"
          value={meta.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </Field>
    </div>
  );
}
