import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  computeTax,
  estimateTds,
  formatCurrency,
  formatDate,
  lineItemAmount,
  numberToWords,
  subtotal,
} from "@/lib/calculations";
import { InvoiceState } from "@/lib/types";

// Standard PDF base-14 fonts (Helvetica/Courier) predate the ₹ Unicode
// codepoint (added 2010) and can't render it — Noto Sans covers it.
Font.register({
  family: "NotoSans",
  fonts: [
    { src: "/fonts/noto-sans-400.ttf", fontWeight: 400 },
    { src: "/fonts/noto-sans-700.ttf", fontWeight: 700 },
  ],
});
Font.register({
  family: "NotoSansMono",
  fonts: [
    { src: "/fonts/noto-sans-mono-400.ttf", fontWeight: 400 },
    { src: "/fonts/noto-sans-mono-700.ttf", fontWeight: 700 },
  ],
});
// Default hyphenation splits long words mid-way to fill a line (e.g.
// "Ra-jasthan") — treat every word as atomic instead.
Font.registerHyphenationCallback((word) => [word]);

export async function preloadInvoicePdfFonts() {
  await Promise.all([
    Font.load({ fontFamily: "NotoSans", fontWeight: 400 }),
    Font.load({ fontFamily: "NotoSans", fontWeight: 700 }),
    Font.load({ fontFamily: "NotoSansMono", fontWeight: 400 }),
    Font.load({ fontFamily: "NotoSansMono", fontWeight: 700 }),
  ]);
}

const COLOR = {
  ink: "#111111",
  body: "#333333",
  muted: "#666666",
  faint: "#999999",
  border: "#d6d6d6",
  borderStrong: "#bbbbbb",
  rowBorder: "#e2e2e2",
  panel: "#fafafa",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "NotoSans",
    color: COLOR.body,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
    paddingBottom: 18,
    marginBottom: 20,
  },
  title: {
    fontFamily: "NotoSansMono",
    fontWeight: 700,
    fontSize: 22,
    color: COLOR.ink,
    textAlign: "center",
  },
  titleNumber: {
    fontFamily: "NotoSansMono",
    fontSize: 9,
    color: COLOR.muted,
    textAlign: "center",
    marginTop: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  identity: {
    flexDirection: "column",
    maxWidth: "60%",
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 6,
    objectFit: "cover",
    borderRadius: 4,
  },
  name: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    fontSize: 12,
    color: COLOR.ink,
  },
  tagline: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 2,
  },
  smallMuted: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 2,
  },
  metaBox: {
    alignItems: "flex-end",
  },
  label: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    fontSize: 7,
    color: COLOR.faint,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaNumber: {
    fontFamily: "NotoSansMono",
    fontSize: 9,
    color: COLOR.ink,
    marginTop: 4,
  },
  metaDatesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    minWidth: 150,
  },
  metaDateLabel: {
    fontSize: 8,
    color: COLOR.faint,
  },
  metaDateValue: {
    fontSize: 8,
    fontFamily: "NotoSans",
    fontWeight: 700,
    color: COLOR.ink,
  },
  parties: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  partyCol: {
    maxWidth: "48%",
  },
  partyColRight: {
    maxWidth: "48%",
    alignItems: "flex-end",
  },
  partyName: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    fontSize: 10,
    color: COLOR.ink,
    marginTop: 4,
  },
  partyLine: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 2,
  },
  partyLineRight: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 2,
    textAlign: "right",
  },
  mono: {
    fontFamily: "NotoSansMono",
  },
  table: {
    marginBottom: 20,
  },
  tableHeadRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.borderStrong,
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.rowBorder,
    paddingVertical: 7,
  },
  th: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    fontSize: 7,
    color: COLOR.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  td: {
    fontSize: 9,
    color: COLOR.ink,
  },
  tdMuted: {
    fontSize: 9,
    color: COLOR.muted,
  },
  tdMono: {
    fontFamily: "NotoSansMono",
    fontSize: 9,
    color: COLOR.ink,
  },
  colDescription: { width: "40%" },
  colDescriptionNoHsn: { width: "52%" },
  colHsn: { width: "12%", textAlign: "right" },
  colQty: { width: "10%", textAlign: "right" },
  colRate: { width: "18%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  totalsWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsLabel: {
    fontSize: 9,
    color: COLOR.muted,
  },
  totalsValue: {
    fontFamily: "NotoSansMono",
    fontSize: 9,
    color: COLOR.ink,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLOR.borderStrong,
    paddingTop: 6,
    marginTop: 2,
  },
  grandTotalLabel: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    fontSize: 11,
    color: COLOR.ink,
  },
  grandTotalValue: {
    fontFamily: "NotoSansMono",
    fontWeight: 700,
    fontSize: 11,
    color: COLOR.ink,
  },
  tdsBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    borderStyle: "dashed",
  },
  tdsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  tdsLabel: {
    fontSize: 8,
    color: COLOR.faint,
  },
  tdsValue: {
    fontFamily: "NotoSansMono",
    fontSize: 8,
    color: COLOR.faint,
  },
  tdsNetLabel: {
    fontSize: 8,
    fontFamily: "NotoSans",
    fontWeight: 700,
    color: COLOR.muted,
  },
  tdsNetValue: {
    fontFamily: "NotoSansMono",
    fontWeight: 700,
    fontSize: 8,
    color: COLOR.muted,
  },
  wordsLine: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 10,
    textAlign: "right",
  },
  wordsLabel: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    color: COLOR.ink,
  },
  noteBox: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLOR.border,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.ink,
    backgroundColor: COLOR.panel,
    padding: 8,
  },
  noteBoxText: {
    fontSize: 7.5,
    color: COLOR.muted,
    lineHeight: 1.4,
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    paddingTop: 14,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  detailLabel: {
    fontSize: 8,
    color: COLOR.faint,
  },
  detailValue: {
    fontSize: 8,
    color: COLOR.ink,
  },
  detailValueMono: {
    fontFamily: "NotoSansMono",
    fontSize: 8,
    color: COLOR.ink,
  },
  proseLabel: {
    fontFamily: "NotoSans",
    fontWeight: 700,
    fontSize: 7,
    color: COLOR.faint,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  proseText: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 4,
    lineHeight: 1.4,
  },
  signatureWrap: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signatureBox: {
    width: 140,
    alignItems: "center",
  },
  signatureImage: {
    height: 36,
    maxWidth: 140,
    objectFit: "contain",
    marginBottom: 4,
  },
  signatureImageSpacer: {
    height: 30,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    width: "100%",
  },
  signatureCaption: {
    fontSize: 8,
    color: COLOR.muted,
    marginTop: 4,
  },
});

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={mono ? styles.detailValueMono : styles.detailValue}>{value}</Text>
    </View>
  );
}

interface Props {
  invoice: InvoiceState;
}

export function InvoicePdfDocument({ invoice }: Props) {
  const { profile, client, meta, items } = invoice;
  const tax = computeTax(items, meta.gstTreatment);
  const showHsn = meta.gstTreatment !== "unregistered";
  const isExport = meta.gstTreatment === "export_lut";
  const isForeignCurrency = meta.currency !== "INR";
  const tdsAmount = estimateTds(tax.taxable, meta.tdsRate);
  const netAfterTds = tax.grandTotal - tdsAmount;

  return (
    <Document title={`Invoice ${meta.number}`.trim()}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.titleNumber}>{meta.number || "—"}</Text>

          <View style={styles.headerRow}>
            <View style={styles.identity}>
              {profile.logo && (
                // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, no alt prop
                <Image src={profile.logo} style={styles.logo} />
              )}
              <Text style={styles.name}>{profile.name || "Your name"}</Text>
              {profile.tagline && <Text style={styles.tagline}>{profile.tagline}</Text>}
              {profile.address && (
                <Text style={styles.smallMuted}>{profile.address}</Text>
              )}
              {(profile.email || profile.phone) && (
                <Text style={styles.smallMuted}>
                  {[profile.email, profile.phone].filter(Boolean).join("   ·   ")}
                </Text>
              )}
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.label}>Invoice details</Text>
              <Text style={styles.metaNumber}>Invoice No. {meta.number || "—"}</Text>
              <View style={styles.metaDatesRow}>
                <Text style={styles.metaDateLabel}>Date issued</Text>
                <Text style={styles.metaDateValue}>{formatDate(meta.date)}</Text>
              </View>
              <View style={styles.metaDatesRow}>
                <Text style={styles.metaDateLabel}>Due date</Text>
                <Text style={styles.metaDateValue}>{formatDate(meta.dueDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.parties}>
          <View style={styles.partyCol}>
            <Text style={styles.label}>Billed by</Text>
            <Text style={styles.partyName}>{profile.name || "—"}</Text>
            {profile.pan && (
              <Text style={styles.partyLine}>
                PAN <Text style={styles.mono}>{profile.pan}</Text>
              </Text>
            )}
            {profile.gstin && (
              <Text style={styles.partyLine}>
                GSTIN <Text style={styles.mono}>{profile.gstin}</Text>
              </Text>
            )}
            {profile.udyam && (
              <Text style={styles.partyLine}>
                Udyam <Text style={styles.mono}>{profile.udyam}</Text>
              </Text>
            )}
            <Text style={styles.partyLine}>{profile.state}, India</Text>
          </View>
          <View style={styles.partyColRight}>
            <Text style={styles.label}>Billed to</Text>
            <Text style={[styles.partyName, { textAlign: "right" }]}>
              {client.name || "—"}
            </Text>
            {client.gstin && (
              <Text style={styles.partyLineRight}>
                GSTIN <Text style={styles.mono}>{client.gstin}</Text>
              </Text>
            )}
            <Text style={styles.partyLineRight}>
              {client.state ? `${client.state}, ` : ""}
              {client.country}
            </Text>
            {client.email && <Text style={styles.partyLineRight}>{client.email}</Text>}
          </View>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableHeadRow}>
            <Text style={[styles.th, showHsn ? styles.colDescription : styles.colDescriptionNoHsn]}>
              Description
            </Text>
            {showHsn && <Text style={[styles.th, styles.colHsn]}>SAC</Text>}
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colRate]}>Rate</Text>
            <Text style={[styles.th, styles.colAmount]}>Amount</Text>
          </View>
          {items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={[styles.td, showHsn ? styles.colDescription : styles.colDescriptionNoHsn]}>
                {item.description || "—"}
              </Text>
              {showHsn && (
                <Text style={[styles.tdMuted, styles.mono, styles.colHsn]}>
                  {item.hsnSac || "—"}
                </Text>
              )}
              <Text style={[styles.tdMuted, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tdMuted, styles.mono, styles.colRate]}>
                {formatCurrency(item.rate, meta.currency)}
              </Text>
              <Text style={[styles.tdMono, styles.colAmount]}>
                {formatCurrency(lineItemAmount(item), meta.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>
                {formatCurrency(subtotal(items), meta.currency)}
              </Text>
            </View>
            {tax.treatment === "intra_state" && (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>CGST (9%)</Text>
                  <Text style={styles.totalsValue}>
                    {formatCurrency(tax.cgst, meta.currency)}
                  </Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>SGST (9%)</Text>
                  <Text style={styles.totalsValue}>
                    {formatCurrency(tax.sgst, meta.currency)}
                  </Text>
                </View>
              </>
            )}
            {tax.treatment === "inter_state" && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>IGST (18%)</Text>
                <Text style={styles.totalsValue}>
                  {formatCurrency(tax.igst, meta.currency)}
                </Text>
              </View>
            )}
            {tax.treatment === "export_lut" && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>GST</Text>
                <Text style={styles.totalsValue}>Zero-rated (LUT)</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatCurrency(tax.grandTotal, meta.currency)}
              </Text>
            </View>
            {meta.showTdsNote && tdsAmount > 0 && (
              <View style={styles.tdsBox}>
                <View style={styles.tdsRow}>
                  <Text style={styles.tdsLabel}>
                    Est. TDS (Sec {meta.tdsSection}, {meta.tdsRate}%)
                  </Text>
                  <Text style={styles.tdsValue}>
                    -{formatCurrency(tdsAmount, meta.currency)}
                  </Text>
                </View>
                <View style={styles.tdsRow}>
                  <Text style={styles.tdsNetLabel}>Net receivable after TDS</Text>
                  <Text style={styles.tdsNetValue}>
                    {formatCurrency(netAfterTds, meta.currency)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {!isForeignCurrency && (
          <Text style={styles.wordsLine}>
            <Text style={styles.wordsLabel}>Amount in words: </Text>
            {numberToWords(tax.grandTotal, meta.currency)}
          </Text>
        )}

        {isExport && (
          <View style={styles.noteBox}>
            <Text style={styles.noteBoxText}>
              Supply meant for export under Letter of Undertaking (LUT) without payment of
              integrated tax.
            </Text>
          </View>
        )}

        {/* Payment details */}
        {(profile.bank.accountNumber || profile.bank.upiId) && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <View style={{ width: "58%" }}>
                <Text style={styles.label}>Payment details</Text>
                {profile.bank.accountName && (
                  <DetailRow label="Account name" value={profile.bank.accountName} />
                )}
                {profile.bank.bankName && (
                  <DetailRow label="Bank name" value={profile.bank.bankName} />
                )}
                {profile.bank.accountNumber && (
                  <DetailRow label="Account no." value={profile.bank.accountNumber} mono />
                )}
                {profile.bank.ifsc && (
                  <DetailRow label="IFSC code" value={profile.bank.ifsc} mono />
                )}
                {profile.bank.swiftCode && (
                  <DetailRow label="SWIFT code" value={profile.bank.swiftCode} mono />
                )}
              </View>
              {profile.bank.upiId && (
                <View style={{ width: "38%" }}>
                  <Text style={styles.label}>UPI</Text>
                  <DetailRow label="UPI ID" value={profile.bank.upiId} mono />
                </View>
              )}
            </View>
          </View>
        )}

        {(meta.notes || meta.terms) && (
          <View style={styles.section}>
            {meta.notes && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.proseLabel}>Notes</Text>
                <Text style={styles.proseText}>{meta.notes}</Text>
              </View>
            )}
            {meta.terms && (
              <View>
                <Text style={styles.proseLabel}>Terms</Text>
                <Text style={styles.proseText}>{meta.terms}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.signatureWrap}>
          <View style={styles.signatureBox}>
            {profile.signature ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, no alt prop
              <Image src={profile.signature} style={styles.signatureImage} />
            ) : (
              <View style={styles.signatureImageSpacer} />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatureCaption}>Authorized Signatory</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
