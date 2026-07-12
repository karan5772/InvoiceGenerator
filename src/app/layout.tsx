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
  "Instant, free invoice generator for Indian freelancers. No sign-up, no watermark: GST invoices with automatic CGST/SGST/IGST, clean invoices without a GSTIN, exports under LUT, TDS notes, and real PDF downloads.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Free Invoice Generator for Indian Freelancers — Instant, No Sign-Up",
    template: `%s — ${SITE.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    "free invoice generator",
    "invoice generator no sign up",
    "instant invoice generator",
    "invoice generator india",
    "GST invoice generator",
    "freelancer invoice",
    "invoice without GSTIN",
    "invoice generator without watermark",
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
    title: "Free Invoice Generator for Indian Freelancers — Instant, No Sign-Up",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator for Indian Freelancers — Instant, No Sign-Up",
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
