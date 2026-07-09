import { CURRENCIES, Currency, GstTreatment, LineItem } from "./types";

export const GST_RATE = 18;

export function lineItemAmount(item: LineItem): number {
  return (Number(item.quantity) || 0) * (Number(item.rate) || 0);
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + lineItemAmount(item), 0);
}

export interface TaxBreakdown {
  treatment: GstTreatment;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
}

export function computeTax(items: LineItem[], treatment: GstTreatment): TaxBreakdown {
  const taxable = subtotal(items);

  if (treatment === "unregistered" || treatment === "export_lut") {
    return {
      treatment,
      taxable,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalTax: 0,
      grandTotal: taxable,
    };
  }

  if (treatment === "intra_state") {
    const half = round2((taxable * GST_RATE) / 100 / 2);
    return {
      treatment,
      taxable,
      cgst: half,
      sgst: half,
      igst: 0,
      totalTax: half * 2,
      grandTotal: round2(taxable + half * 2),
    };
  }

  // inter_state
  const igst = round2((taxable * GST_RATE) / 100);
  return {
    treatment,
    taxable,
    cgst: 0,
    sgst: 0,
    igst,
    totalTax: igst,
    grandTotal: round2(taxable + igst),
  };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const meta = CURRENCIES.find((c) => c.code === currency);
  const symbol = meta?.symbol ?? "";
  const formatted =
    currency === "INR"
      ? formatIndianNumber(amount)
      : amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${symbol}${formatted}`;
}

export function formatIndianNumber(amount: number): string {
  const fixed = round2(amount).toFixed(2);
  const [whole, decimal] = fixed.split(".");
  const negative = whole.startsWith("-");
  const digits = negative ? whole.slice(1) : whole;

  let result: string;
  if (digits.length <= 3) {
    result = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    result = `${grouped},${last3}`;
  }
  return `${negative ? "-" : ""}${result}.${decimal}`;
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${TENS[t]}${o ? " " + ONES[o] : ""}`;
}

function threeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} Hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(" ");
}

/** Converts a number to words using the Indian numbering system (lakh/crore). */
export function numberToIndianWords(amount: number): string {
  const rounded = round2(amount);
  const whole = Math.floor(rounded);
  const paise = Math.round((rounded - whole) * 100);

  if (whole === 0 && paise === 0) return "Zero Rupees Only";

  const crore = Math.floor(whole / 10000000);
  const lakh = Math.floor((whole % 10000000) / 100000);
  const thousand = Math.floor((whole % 100000) / 1000);
  const hundred = whole % 1000;

  const segments: string[] = [];
  if (crore) segments.push(`${threeDigits(crore)} Crore`);
  if (lakh) segments.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) segments.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) segments.push(threeDigits(hundred));

  let words = segments.join(" ").trim();
  words = words ? `${words} Rupees` : "";

  if (paise) {
    words += `${words ? " and " : ""}${threeDigits(paise)} Paise`;
  }

  return `${words} Only`.trim();
}

export function numberToWords(amount: number, currency: Currency): string {
  if (currency === "INR") return numberToIndianWords(amount);
  const meta = CURRENCIES.find((c) => c.code === currency);
  return `${meta?.label ?? currency} ${amount.toFixed(2)} Only`;
}

export function estimateTds(taxableAmount: number, rate: number): number {
  return round2((taxableAmount * rate) / 100);
}
