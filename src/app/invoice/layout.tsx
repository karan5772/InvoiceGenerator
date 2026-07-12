import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Invoice Online, Free",
  description:
    "Fill in your details and download a professional invoice as PDF or PNG. GST invoices with CGST/SGST/IGST, non-GST invoices, exports under LUT, and TDS notes. Free, no sign-up.",
  alternates: { canonical: "/invoice" },
  openGraph: {
    title: "Create an Invoice Online, Free",
    description:
      "Fill in your details and download a professional invoice as PDF or PNG. GST and non-GST supported. Free, no sign-up.",
    url: "/invoice",
  },
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
