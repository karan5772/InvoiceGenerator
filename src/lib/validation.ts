const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function panError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!PAN_PATTERN.test(trimmed)) {
    return "Doesn't look like a valid PAN (format: ABCDE1234F)";
  }
  return undefined;
}

export function gstinError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!GSTIN_PATTERN.test(trimmed)) {
    return "Doesn't look like a valid GSTIN (format: 29ABCDE1234F1Z5)";
  }
  return undefined;
}
