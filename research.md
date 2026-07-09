# Indian Freelancer Invoicing — Tax & Legal Research

Research compiled to inform the design of an invoice generator for Indian freelancers /
independent consultants. Every rule below is tagged **COMPULSORY**, **CONDITIONAL**, or
**OPTIONAL / BEST PRACTICE**, with citations to primary sources where available.

> **Disclaimer:** This is a plain-language summary for product design purposes, not tax
> or legal advice. Rates and thresholds change with each Union Budget — verify current
> figures with a CA or the official portals linked below before relying on this for a
> real filing.

---

## 1. GST registration

| Rule | Status | Detail |
|---|---|---|
| Registration threshold | **CONDITIONAL** | Mandatory once **aggregate turnover** (services) crosses **₹20 lakh** in a financial year in most states, or **₹10 lakh** in special-category / North-Eastern states.[^1] Below this, a freelancer is **not required to register, not required to charge GST, and not required to issue GST tax invoices**.[^2] |
| How turnover is counted | Fact | Aggregate turnover is computed **PAN-wide across all business locations in India**, not state-by-state.[^3] |
| Inter-state supply of services | **CONDITIONAL, not automatic** | Unlike goods, a **service provider is not forced into mandatory registration merely because a client is in another state** (inter-state supply). Registration is still governed by the ₹20L/₹10L turnover threshold — our research specifically checked and **rejected** the common claim that "any inter-state supply of services mandates GST registration regardless of turnover" as false.[^refute-1] |
| Voluntary registration | **OPTIONAL** | A freelancer under the threshold may register voluntarily (e.g., to claim input tax credit or look more credible to enterprise clients). Once registered, all GST invoicing rules below apply regardless of turnover. |
| Applicable rate | **COMPULSORY once registered** | Freelance/professional services default to **18% GST** (9% CGST + 9% SGST, or 18% IGST) when no more specific rate is notified for the service category (SAC code).[^4] |

---

## 2. GST tax invoice — mandatory fields (Rule 46, CGST Rules 2017)

Once GST-registered, **every** tax invoice must legally contain (per official CBIC text of
Rule 46):[^5][^6]

- Supplier's **name, address, and GSTIN**
- A **consecutive serial number**, unique for the financial year, using only letters,
  numerals, hyphens (`-`) and slashes (`/`), **not exceeding 16 characters**[^7][^8]
- **Date of issue**
- Recipient's **name, address, and GSTIN/UIN** (if the recipient is registered)
- **HSN code** (goods) or **Accounting/SAC code** (services)
- **Description** of the service
- **Quantity** (for goods) and **total value**
- **Taxable value** (after any discount/abatement)
- **Rate of tax** — CGST / SGST / IGST / UTGST / cess, shown separately
- **Amount of tax charged**, split by tax head
- **Place of supply** and the name of the destination state, for inter-state supply
- Whether tax is payable under **reverse charge**
- **Signature or digital signature** of the supplier or an authorised representative

**Exception:** a signature is **not required** on an invoice issued electronically, under
the IT Act, 2000 — so a PDF/emailed invoice from a freelancer's own tool is compliant
without a wet or digital signature.[^9][^10]

### Export invoices — extra requirement
For export of services, Rule 46 requires the invoice carry one of two fixed endorsements
in place of standard recipient details:[^11]

> *"SUPPLY MEANT FOR EXPORT ... ON PAYMENT OF INTEGRATED TAX"*, or
> *"SUPPLY MEANT FOR EXPORT ... UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF
> INTEGRATED TAX"*

along with the recipient's name/address, delivery address, and destination country. (Note:
"shipping details" sometimes cited alongside this is a goods-export concept and does not
apply to a pure services invoice — a broader blog claim bundling shipping details in with
services-export invoices was checked and rejected.[^refute-3])

---

## 3. CGST + SGST vs IGST — which applies when

| Scenario | Tax charged |
|---|---|
| Freelancer's registered state **==** client's state (intra-state) | **CGST 9% + SGST 9%** = 18% total |
| Freelancer's state **≠** client's state, both in India (inter-state) | **IGST 18%** |
| Client outside India, payment received in convertible foreign exchange, export conditions met | **Zero-rated** — either (a) pay IGST and claim refund, or (b) **export under LUT with no IGST charged at all** (the far more common freelancer path) |
| Not GST-registered | **No GST charged**, regardless of client location |

---

## 4. Invoices for freelancers who are **not** GST-registered

**COMPULSORY minimum**, under general contract/commercial-document norms (no dedicated
GST-style invoice law applies below the threshold since such a person is legally outside
the GST net):[^2]

- Your name / business name and address
- A unique, sequential invoice number and date
- Client's name and billing address
- Description of services, quantity/hours, rate, and total amount
- Total amount payable, currency

**Must NOT contain:**
- A GSTIN (you don't have one) or any GST/tax line — only a GST-registered supplier may
  legally collect GST from a client.

**OPTIONAL / best practice:**
- PAN (helps the client apply correct TDS and avoids ambiguity in Form 26AS reconciliation)
- Payment terms / due date, bank or UPI details, notes

---

## 5. TDS (Tax Deducted at Source) the client may withhold

| Rule | Status | Detail |
|---|---|---|
| Section 194J rate | **CONDITIONAL** | Clients paying for **professional services** (design, consulting, dev work, etc.) deduct **10% TDS**; purely **technical services** are taxed at **2%**.[^12] |
| ₹50,000 threshold | **CONDITIONAL** | No TDS is required under 194J if the aggregate payments to that freelancer **in the financial year stay within ₹50,000**.[^13] |
| PAN and higher TDS (Section 206AA) | **Standard rule, flagged for care** | Under Section 206AA of the Income Tax Act, a payee who does not furnish PAN can be subjected to TDS at a flat **20%** instead of the normal 194J rate. This is well-established law; our automated verification pass returned a noisy/inconclusive result on this specific claim, so treat it as **very likely true but re-confirm with a CA** rather than citing it as independently re-verified here.[^refute-2] Practically: **always put your PAN on the invoice** to avoid the client over-withholding. |

TDS is deducted by the client from the payment, **not** subtracted from the invoice total
itself — a GST/commercial invoice should show the full billed amount; TDS only reduces
what actually lands in the freelancer's bank account, reflected in Form 26AS.

---

## 6. Presumptive taxation — Section 44ADA

| Rule | Status | Detail |
|---|---|---|
| Deemed profit | Fact | Eligible professionals may declare taxable income as a flat **50% of gross receipts**, skipping itemized expense bookkeeping.[^14] |
| Turnover ceiling | **CONDITIONAL** | Base limit **₹50 lakh** gross receipts; extendable to **₹75 lakh** if at least 95% of receipts are through banking/digital channels (cash ≤ 5%).[^15] |
| Relation to invoicing | Practical | 44ADA doesn't change what must appear on an invoice, but it does mean a freelancer under this scheme mainly needs a clean, dated **record of every invoice issued and paid** — sequential invoice numbers and consistent record-keeping become the de facto "books" that matter, rather than full double-entry accounts (which is what 44AA/44AB would otherwise require above the threshold). |

---

## 7. Export of services — LUT, zero-rating, FEMA

- **Zero-rated supply conditions:** to qualify as an "export of service" (Section 2(6),
  IGST Act) — and thus be zero-rated rather than taxed — five conditions must **all** be
  met: supplier in India; recipient outside India; place of supply outside India; payment
  received in convertible foreign exchange (or INR to the extent RBI permits); and
  supplier and recipient are not merely two establishments of the same legal person.
- **LUT (Letter of Undertaking):** any GST-registered person wanting to export services
  **without paying IGST up front** must furnish an LUT via **Form GST RFD-11** on the GST
  portal.[^16] Without an LUT, the alternative is paying IGST and claiming a refund —
  operationally worse for a small freelancer, so filing the LUT is the standard path.
- **LUT validity:** an LUT is valid only for **one financial year** and must be **re-filed
  every year**; it auto-expires at year-end.[^17]
- **LUT eligibility exclusion:** a taxpayer **prosecuted for tax evasion of ₹2.5 crore or
  more** under GST (or predecessor) law cannot file an LUT and must furnish a bond
  instead.[^18] Irrelevant for the overwhelming majority of freelancers, but worth noting
  for completeness.
- **FEMA / FIRC:** payments from foreign clients arrive via banking channels and the bank
  issues a **Foreign Inward Remittance Certificate (FIRC)** or e-FIRC per remittance —
  keep these on file; they're commonly requested as proof of export-of-services status and
  for LUT/GST reconciliation. (General FEMA/RBI knowledge — this specific sub-claim wasn't
  independently re-verified by the automated pass and should be sanity-checked with a CA
  or the freelancer's bank if it becomes central to compliance.)
- **Invoice currency:** invoicing in the foreign client's currency (USD/EUR/GBP/etc.) is
  normal and expected; the invoice should still show the exporter's own GSTIN if
  registered, and the LUT export endorsement (Section 2 above) if zero-rating is claimed.

---

## 8. MSME / Udyam registration

- **OPTIONAL.** A freelancer/sole proprietor can register as a **Micro** enterprise on the
  **Udyam portal** — free, mostly self-certified, and not tied to GST registration status.
- **Benefit:** registered micro/small enterprises can use **MSME Samadhaan**, a government
  delayed-payment redressal mechanism — buyers are legally required to pay MSME-registered
  suppliers within **45 days**, and a registered supplier can file a complaint if they
  don't.[^19]
- **On the invoice:** referencing your **Udyam Registration Number** on invoices is common
  best practice (it signals the 45-day payment obligation to the client and provides
  a paper trail if a Samadhaan complaint is ever needed) but is **not a legal requirement**
  to include on every invoice.

---

## 9. E-invoicing (IRN / QR code)

- **NOT APPLICABLE to virtually all freelancers.** E-invoicing (generating an Invoice
  Reference Number and QR code via the government's Invoice Registration Portal) is
  mandatory only for GST-registered taxpayers with **aggregate turnover above ₹5 crore**
  in any financial year from 2017-18 onward (effective 1 Aug 2023, per the sixth-phase
  CBIC notification).[^20] This is far beyond typical individual freelancer income, so an
  invoice generator aimed at freelancers can safely skip IRN/QR-code generation.

---

## 10. Signatures

- A **physical or digital signature is not required** on an invoice issued electronically
  (PDF, emailed, etc.) under the IT Act, 2000 — this applies whether or not the freelancer
  is GST-registered.[^9][^10]
- **Best practice, not law:** many freelancers still include a signature image or an
  "Authorized Signatory" line for a more formal/professional look, especially for larger
  corporate clients — cosmetic, not compliance-driven.

---

## 11. Professional Tax (P Tax) — brief context

Some states (e.g., Maharashtra, Karnataka, West Bengal, Telangana) levy a small annual
**Professional Tax** on self-employed professionals, collected by the state, not shown on
client invoices. It's a personal registration/payment obligation of the freelancer in
applicable states, not an invoice field — included here only so the app's "your details"
section doesn't need a P Tax field, which would be a common but unnecessary addition.

---

## 12. Final invoice-field checklist

### Always required (any freelancer, any client)
- Your name / business name and address
- Sequential, unique invoice number
- Invoice date
- Client name and billing address
- Description of goods/services, quantity, rate, line amount
- Total amount payable and currency

### Required only if GST-registered
- Your **GSTIN**
- Client's **GSTIN** (if the client is GST-registered)
- **HSN/SAC code** per line item
- **Taxable value** and **rate of tax** shown separately from the taxable value
- **CGST + SGST** (intra-state) or **IGST** (inter-state) amounts, clearly split
- **Place of supply** (state) for inter-state transactions
- Note on **reverse charge** applicability (rare for freelance services, but the field
  should exist)

### Required only if exporting services / foreign client
- The fixed **LUT / IGST export endorsement** text (Section 2 above)
- Recipient name, address, and **destination country** in place of a domestic GSTIN block
- Currency of invoicing (foreign currency) and, ideally, an exchange-rate note
- No signature/QR requirements beyond the general rules — export doesn't add extra
  signature or e-invoicing obligations for a sub-₹5-crore freelancer

### Optional / best practice (not legally mandated)
- Your **PAN** (reduces risk of higher TDS withholding under Section 206AA)
- **Udyam registration number**
- Bank account / IFSC / UPI ID / SWIFT code for payment
- Due date and payment terms
- An **"Amount in words"** line (Indian numbering: lakh/crore) — conventional, not
  mandatory
- An informational **estimated TDS** line, clearly marked as non-binding and for the
  freelancer's own reference (since TDS is the client's deduction, not part of the legal
  invoice total)
- Signature line / logo — cosmetic

---

## Sources

[^1]: [ClearTax — Impact analysis: freelancers under GST](https://cleartax.in/s/impact-analysis-freelancers-under-gst)
[^2]: [Riffit — Invoice without GST number in India](https://www.riffit.in/blog/invoice-without-gst-number-india)
[^3]: [JetInvoice — How to create an invoice without GST in India](https://jetinvoice.in/blog/how-to-create-an-invoice-without-gst-in-india)
[^4]: [ClearTax — Impact analysis: freelancers under GST](https://cleartax.in/s/impact-analysis-freelancers-under-gst)
[^5]: [CBIC Tax Information Portal — Rule 46, CGST Rules 2017](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule46_v1.00.html)
[^6]: [GST Council — Tax Invoice and other such instruments in GST (official flyer, PDF)](https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Tax_Invoice_and_other_new.pdf)
[^7]: [CBIC — Rule 46, CGST Rules 2017](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule46_v1.00.html)
[^8]: [GimBooks — GST invoice mandatory fields, Rule 46 checklist](https://www.gimbooks.com/blog/gst-invoice-mandatory-fields-rule-46-checklist/)
[^9]: [GST Council — Tax Invoice and other such instruments in GST (official flyer, PDF)](https://gstcouncil.gov.in/sites/default/files/e-version-gst-flyers/Tax_Invoice_and_other_new.pdf)
[^10]: [GimBooks — GST invoice mandatory fields, Rule 46 checklist](https://www.gimbooks.com/blog/gst-invoice-mandatory-fields-rule-46-checklist/)
[^11]: [CBIC — Rule 46, CGST Rules 2017](https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/rules/cgst_rules/active/chapter6/rule46_v1.00.html)
[^12]: [ClearTax — Section 194J: TDS on professional fees and technical services](https://cleartax.in/s/section-194j)
[^13]: [ClearTax — Section 194J](https://cleartax.in/s/section-194j)
[^14]: [ClearTax — Section 44ADA](https://cleartax.in/s/section-44ada)
[^15]: [ClearTax — Section 44ADA](https://cleartax.in/s/section-44ada)
[^16]: [GST Portal — Furnishing of Letter of Undertaking for Export of Goods or Services (official user guide)](https://tutorial.gst.gov.in/userguide/refund/Furnishing_of_Letter_of_Undertaking_for_Export_of_Goods_or_Services.htm)
[^17]: [GST Portal — LUT user guide](https://tutorial.gst.gov.in/userguide/refund/Furnishing_of_Letter_of_Undertaking_for_Export_of_Goods_or_Services.htm)
[^18]: [GST Portal — LUT user guide](https://tutorial.gst.gov.in/userguide/refund/Furnishing_of_Letter_of_Undertaking_for_Export_of_Goods_or_Services.htm)
[^19]: [IndiaFilings — MSME Samadhaan](https://www.indiafilings.com/learn/msme-samadhaan)
[^20]: [CGST Jaipur — e-invoicing applicability notification (PDF)](https://cgstjaipur.gov.in/Attachments/e72f49f2-6237-45e9-ae62-6e0d742f534a.pdf)

[^refute-1]: Checked and rejected during research: "GST registration is mandatory for any inter-state supply of services... regardless of turnover threshold" — false; services get relief that goods don't.
[^refute-2]: Section 206AA higher-TDS-without-PAN claim returned an inconclusive automated verification vote (1 confirm / 2 refute) despite being standard, well-documented law — flagged here for a manual double-check rather than silently dropped or overstated.
[^refute-3]: Checked and rejected: a compound claim requiring "shipping details" on services-export invoices — shipping details are a goods-export concept, not applicable to services.

---

### How this maps onto the app

The invoice generator implements this research as: a GST-treatment selector
(unregistered / intra-state CGST+SGST / inter-state IGST / export under LUT) that shows
only the fields relevant to the selected mode, an optional PAN/GSTIN/Udyam block, an
LUT export-declaration line that appears automatically when "export under LUT" is chosen,
and an informational (not total-affecting) estimated-TDS line under Section 194J.
