"use client";

import { ChangeEvent, useRef } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { BusinessProfile, INDIAN_STATES } from "@/lib/types";
import { cn } from "@/lib/cn";
import { gstinError, panError } from "@/lib/validation";

interface Props {
  profile: BusinessProfile;
  onChange: (patch: Partial<BusinessProfile>) => void;
}

interface ImageUploadProps {
  label: string;
  value: string;
  accept: string;
  shape: "square" | "wide";
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}

function ImageUpload({ label, value, accept, shape, onUpload, onRemove }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={cn(
          "group relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-default bg-surface-secondary text-text-tertiary transition-colors hover:border-accent hover:text-accent",
          shape === "square" ? "size-16" : "h-16 w-28",
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className={cn(
              shape === "square" ? "size-full object-cover" : "size-full object-contain p-1.5",
            )}
          />
        ) : (
          <svg width="20" height="20" viewBox="0 0 15 15" fill="none">
            <path
              d="M7.5 2v11M2 7.5h11"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs font-medium text-accent hover:underline"
          >
            Upload
          </button>
          {value && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-medium text-text-tertiary hover:text-red-500"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  );
}

export function BusinessDetailsForm({ profile, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <ImageUpload
          label="Logo (optional)"
          value={profile.logo}
          accept="image/*"
          shape="square"
          onUpload={(logo) => onChange({ logo })}
          onRemove={() => onChange({ logo: "" })}
        />
        <ImageUpload
          label="Signature (optional, PNG)"
          value={profile.signature}
          accept="image/png"
          shape="wide"
          onUpload={(signature) => onChange({ signature })}
          onRemove={() => onChange({ signature: "" })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Your name / business name" required className="col-span-2">
          <Input
            id="business-name-input"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Aarav Sharma"
          />
        </Field>
        <Field label="Tagline / profession" className="col-span-2">
          <Input
            value={profile.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="Product Design & Frontend Development"
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={profile.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </Field>
        <Field label="Address" className="col-span-2">
          <Textarea
            rows={2}
            value={profile.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Street, city, PIN code"
          />
        </Field>
        <Field label="State" hint="Used to determine CGST+SGST vs IGST" required>
          <Select
            value={profile.state}
            onChange={(e) => onChange({ state: e.target.value })}
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="PAN"
          hint="Helps clients avoid higher TDS under Sec 206AA"
          error={panError(profile.pan)}
        >
          <Input
            value={profile.pan}
            onChange={(e) => onChange({ pan: e.target.value.toUpperCase() })}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="font-mono uppercase"
          />
        </Field>
        <Field
          label="GSTIN"
          hint="Leave blank if you're not registered under GST"
          error={gstinError(profile.gstin)}
        >
          <Input
            value={profile.gstin}
            onChange={(e) => onChange({ gstin: e.target.value.toUpperCase() })}
            placeholder="29ABCDE1234F1Z5"
            maxLength={15}
            className="font-mono uppercase"
          />
        </Field>
        <Field label="Udyam registration no." hint="Optional — MSME registration">
          <Input
            value={profile.udyam}
            onChange={(e) => onChange({ udyam: e.target.value.toUpperCase() })}
            placeholder="UDYAM-XX-00-0000000"
            className="font-mono uppercase"
          />
        </Field>
      </div>

      <div className="mt-1 border-t border-border-subtle pt-4">
        <h3 className="mb-3 text-xs font-medium text-text-secondary">
          Payment details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Account holder name">
            <Input
              value={profile.bank.accountName}
              onChange={(e) =>
                onChange({ bank: { ...profile.bank, accountName: e.target.value } })
              }
            />
          </Field>
          <Field label="Bank name">
            <Input
              value={profile.bank.bankName}
              onChange={(e) => onChange({ bank: { ...profile.bank, bankName: e.target.value } })}
            />
          </Field>
          <Field label="Account number">
            <Input
              value={profile.bank.accountNumber}
              onChange={(e) =>
                onChange({ bank: { ...profile.bank, accountNumber: e.target.value } })
              }
              className="font-mono"
            />
          </Field>
          <Field label="IFSC code">
            <Input
              value={profile.bank.ifsc}
              onChange={(e) =>
                onChange({ bank: { ...profile.bank, ifsc: e.target.value.toUpperCase() } })
              }
              className="font-mono uppercase"
            />
          </Field>
          <Field label="UPI ID" hint="For Indian clients">
            <Input
              value={profile.bank.upiId}
              onChange={(e) => onChange({ bank: { ...profile.bank, upiId: e.target.value } })}
              placeholder="you@okbank"
              className="font-mono"
            />
          </Field>
          <Field label="SWIFT / BIC code" hint="For international wire transfers">
            <Input
              value={profile.bank.swiftCode}
              onChange={(e) =>
                onChange({ bank: { ...profile.bank, swiftCode: e.target.value.toUpperCase() } })
              }
              className="font-mono uppercase"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
