import { InvoiceState, makeEmptyItem } from "./types";

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createSampleInvoice(): InvoiceState {
  return {
    profile: {
      name: "Aarav Sharma",
      tagline: "Product Design & Frontend Development",
      email: "aarav@example.com",
      phone: "+91 98765 43210",
      address: "402, Silver Oak Apartments, Koramangala\nBengaluru, Karnataka 560034",
      state: "Karnataka",
      pan: "ABCDE1234F",
      gstin: "",
      udyam: "",
      logo: "",
      signature: "",
      bank: {
        accountName: "Aarav Sharma",
        accountNumber: "1234567890123",
        ifsc: "HDFC0001234",
        bankName: "HDFC Bank",
        upiId: "aarav@okhdfcbank",
        swiftCode: "",
      },
    },
    client: {
      name: "Northwind Studio LLP",
      email: "accounts@northwind.example",
      address: "12 MG Road, Indiranagar\nBengaluru, Karnataka 560038",
      state: "Karnataka",
      country: "India",
      gstin: "",
    },
    meta: {
      number: "INV-0001",
      date: todayISO(),
      dueDate: addDaysISO(15),
      currency: "INR",
      gstTreatment: "unregistered",
      showTdsNote: true,
      tdsSection: "194J",
      tdsRate: 10,
      notes: "Thank you for the opportunity — looking forward to continuing to work together.",
      terms: "Payment is due within 15 days of the invoice date. Late payments may accrue interest at 1.5% per month.",
    },
    items: [
      {
        ...makeEmptyItem(),
        description: "Landing page redesign — UI/UX design & prototyping",
        hsnSac: "998314",
        quantity: 1,
        rate: 35000,
      },
      {
        ...makeEmptyItem(),
        description: "Frontend implementation (React + Tailwind)",
        hsnSac: "998314",
        quantity: 12,
        rate: 2000,
      },
    ],
  };
}
