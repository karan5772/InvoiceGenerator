import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Invoice Instantly — Free, No Sign-Up",
  description:
    "Fill in your details and download a professional invoice as PDF or PNG in minutes. GST invoices with CGST/SGST/IGST, non-GST invoices, exports under LUT, and TDS notes. Free, instant, no sign-up.",
  alternates: { canonical: "/invoice" },
  openGraph: {
    title: "Create an Invoice Instantly — Free, No Sign-Up",
    description:
      "Fill in your details and download a professional invoice as PDF or PNG in minutes. GST and non-GST supported. Free, no sign-up.",
    url: "/invoice",
  },
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
