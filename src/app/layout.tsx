import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInitScript } from "@/components/theme-toggle";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Create a GST-compliant invoice in minutes, free. Built for Indian freelancers: CGST/SGST/IGST handled automatically, clean invoices without a GSTIN, exports under LUT, TDS notes, and real PDF downloads. No sign-up, no watermark.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Free Invoice Generator for Indian Freelancers (GST & Non-GST)",
    template: `%s — ${SITE.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    "invoice generator india",
    "free invoice generator",
    "GST invoice generator",
    "freelancer invoice",
    "invoice without GSTIN",
    "export invoice LUT",
    "TDS 194J",
    "CGST SGST IGST invoice",
  ],
  authors: [{ name: SITE.developer, url: SITE.github }],
  creator: SITE.developer,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE.name,
    title: "Free Invoice Generator for Indian Freelancers (GST & Non-GST)",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator for Indian Freelancers",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
