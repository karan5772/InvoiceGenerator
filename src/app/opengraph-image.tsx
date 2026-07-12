import { ImageResponse } from "next/og";

export const alt = "Free invoice generator for Indian freelancers, GST and non-GST";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SAFFRON = "#ff671f";
const INDIA_GREEN = "#046a38";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            height: 10,
            width: "100%",
            display: "flex",
            background: `linear-gradient(90deg, ${SAFFRON} 0%, ${SAFFRON} 30%, #0a0a0a 45%, #0a0a0a 55%, ${INDIA_GREEN} 70%, ${INDIA_GREEN} 100%)`,
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 90px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 28,
              color: "#a1a1a1",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: "#ffffff",
                color: "#0a0a0a",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              ₹
            </div>
            Invoice for Indian Freelancers
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              maxWidth: 950,
            }}
          >
            Professional invoices for Indian freelancers.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#a1a1a1",
              maxWidth: 850,
              lineHeight: 1.4,
            }}
          >
            GST or no GST. Free, open source, no sign-up. Your data stays in your
            browser.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
