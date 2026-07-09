export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD" | "SGD" | "AED";

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
];

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type GstTreatment = "unregistered" | "intra_state" | "inter_state" | "export_lut";

export interface LineItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  upiId: string;
  swiftCode: string;
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  pan: string;
  gstin: string;
  udyam: string;
  logo: string; // data URL
  signature: string; // data URL, PNG
  bank: BankDetails;
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
  state: string;
  country: string;
  gstin: string;
}

export interface InvoiceMeta {
  number: string;
  date: string;
  dueDate: string;
  currency: Currency;
  gstTreatment: GstTreatment;
  showTdsNote: boolean;
  tdsSection: "194J" | "194C" | "194H" | "custom";
  tdsRate: number;
  notes: string;
  terms: string;
}

export interface InvoiceState {
  profile: BusinessProfile;
  client: ClientDetails;
  meta: InvoiceMeta;
  items: LineItem[];
}

export const emptyBankDetails: BankDetails = {
  accountName: "",
  accountNumber: "",
  ifsc: "",
  bankName: "",
  upiId: "",
  swiftCode: "",
};

export const emptyProfile: BusinessProfile = {
  name: "",
  tagline: "",
  email: "",
  phone: "",
  address: "",
  state: "Maharashtra",
  pan: "",
  gstin: "",
  udyam: "",
  logo: "",
  signature: "",
  bank: emptyBankDetails,
};

export const emptyClient: ClientDetails = {
  name: "",
  email: "",
  address: "",
  state: "Maharashtra",
  country: "India",
  gstin: "",
};

export function makeEmptyItem(): LineItem {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `item-${Math.random().toString(36).slice(2)}`,
    description: "",
    hsnSac: "",
    quantity: 1,
    rate: 0,
  };
}

export const defaultMeta: InvoiceMeta = {
  number: "INV-0001",
  date: "",
  dueDate: "",
  currency: "INR",
  gstTreatment: "unregistered",
  showTdsNote: false,
  tdsSection: "194J",
  tdsRate: 10,
  notes: "",
  terms: "Payment is due within 15 days of the invoice date.",
};
