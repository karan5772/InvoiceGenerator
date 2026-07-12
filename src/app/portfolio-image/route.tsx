import { ImageResponse } from "next/og";
import { OgCard, OgInvoiceMock } from "@/lib/og-card";

// 16:10 render of the brand card, sized for the portfolio's project-card
// image box (aspect-ratio: 16/10, object-fit: cover) so nothing gets cropped.
export const dynamic = "force-static";

const SIZE = { width: 1200, height: 750 };

export async function GET() {
  return new ImageResponse(
    (
      <OgCard
        title="Professional invoices for Indian freelancers."
        subtitle="GST or no GST. Free, open source, no sign-up. Your data stays in your browser."
        visual={<OgInvoiceMock />}
      />
    ),
    { ...SIZE },
  );
}
