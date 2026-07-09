"use client";

import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ClientDetails, INDIAN_STATES } from "@/lib/types";
import { gstinError } from "@/lib/validation";

const COMMON_COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "United Arab Emirates",
  "Netherlands",
  "Other",
];

interface Props {
  client: ClientDetails;
  onChange: (patch: Partial<ClientDetails>) => void;
}

export function ClientDetailsForm({ client, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Client / business name" required className="col-span-2">
        <Input
          value={client.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Northwind Studio LLP"
        />
      </Field>
      <Field label="Email" className="col-span-2">
        <Input
          type="email"
          value={client.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="accounts@client.com"
        />
      </Field>
      <Field label="Billing address" className="col-span-2">
        <Textarea
          rows={2}
          value={client.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Street, city, PIN / ZIP code"
        />
      </Field>
      <Field label="Country" required>
        <Select value={client.country} onChange={(e) => onChange({ country: e.target.value })}>
          {COMMON_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field
        label="State"
        hint={client.country === "India" ? "Used for place of supply" : "Optional"}
      >
        {client.country === "India" ? (
          <Select value={client.state} onChange={(e) => onChange({ state: e.target.value })}>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            value={client.state}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder="State / province"
          />
        )}
      </Field>
      <Field
        label="Client GSTIN"
        hint="Only if the client is GST-registered in India"
        error={gstinError(client.gstin)}
        className="col-span-2"
      >
        <Input
          value={client.gstin}
          onChange={(e) => onChange({ gstin: e.target.value.toUpperCase() })}
          placeholder="27AAAAA0000A1Z5"
          maxLength={15}
          className="font-mono uppercase"
        />
      </Field>
    </div>
  );
}
