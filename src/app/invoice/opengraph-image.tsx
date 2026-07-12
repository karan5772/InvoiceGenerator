import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, OgInvoiceMock } from "@/lib/og-card";

export const alt = "Create an invoice online, free — GST and non-GST supported";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        title="Create an invoice in minutes."
        subtitle="GST handled automatically. Download as PDF or PNG. Free, no sign-up."
        visual={<OgInvoiceMock />}
      />
    ),
    { ...OG_SIZE },
  );
}
