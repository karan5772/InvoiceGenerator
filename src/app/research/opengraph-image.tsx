import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard, OgStatusPills } from "@/lib/og-card";

export const alt = "GST, TDS and invoicing rules for Indian freelancers, cited to primary sources";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        title="GST, TDS & invoicing rules for Indian freelancers"
        subtitle="What's mandatory, what's optional. Cited to CBIC, the GST Council and the GST portal."
        visual={<OgStatusPills />}
      />
    ),
    { ...OG_SIZE },
  );
}
