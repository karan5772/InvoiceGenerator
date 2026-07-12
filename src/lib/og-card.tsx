import type { ReactNode } from "react";

// Shared template for the per-page Open Graph images. Everything is inline
// styles because these render through next/og (satori), not the DOM — and
// satori requires explicit display:flex on any element with multiple children.

export const OG_SIZE = { width: 1200, height: 630 };

const SAFFRON = "#ff671f";
const INDIA_GREEN = "#046a38";

export function OgCard({
  title,
  subtitle,
  visual,
}: {
  title: string;
  subtitle: string;
  visual?: ReactNode;
}) {
  return (
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
          alignItems: "center",
          gap: 70,
          padding: "0 80px",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 26,
              color: "#a1a1a1",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: 10,
                backgroundColor: "#ffffff",
                color: "#0a0a0a",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ₹
            </div>
            invoice.karanchoudhary.dev
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-2px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 27,
              color: "#a1a1a1",
              lineHeight: 1.45,
            }}
          >
            {subtitle}
          </div>
        </div>
        {visual && <div style={{ display: "flex" }}>{visual}</div>}
      </div>
    </div>
  );
}

export function OgInvoiceMock() {
  const row = (label: string, value: string, color = "#333333") => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 15,
        color,
        marginTop: 8,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 330,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 26,
        color: "#111111",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>INVOICE</span>
        <span style={{ fontSize: 13, color: "#888888" }}>INV-0042</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 1,
          backgroundColor: "#e5e5e5",
          marginTop: 16,
        }}
      />
      {row("Brand identity design", "₹40,000")}
      {row("Landing page build", "₹25,000")}
      <div
        style={{
          display: "flex",
          height: 1,
          backgroundColor: "#e5e5e5",
          marginTop: 14,
        }}
      />
      {row("CGST (9%)", "₹5,850", "#047857")}
      {row("SGST (9%)", "₹5,850", "#047857")}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 19,
          fontWeight: 700,
          marginTop: 14,
        }}
      >
        <span>Total</span>
        <span>₹76,700</span>
      </div>
    </div>
  );
}

export function OgStatusPills() {
  const pill = (label: string, bg: string, color: string) => (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        borderRadius: 999,
        padding: "12px 26px",
        fontSize: 24,
        fontWeight: 700,
        backgroundColor: bg,
        color,
      }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {pill("COMPULSORY", "rgba(244,63,94,0.16)", "#fda4af")}
      {pill("CONDITIONAL", "rgba(245,158,11,0.16)", "#fcd34d")}
      {pill("OPTIONAL", "rgba(59,130,246,0.16)", "#93c5fd")}
    </div>
  );
}
