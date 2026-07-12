# Invoice — free invoice generator for Indian freelancers

**Live at [invoice.karanchoudhary.dev](https://invoice.karanchoudhary.dev)**

A free, GST-aware invoice generator built specifically for Indian freelancers. Whether you're GST-registered, running a company, or sending your very first invoice as a fresher, it produces a compliant, professional invoice in minutes. No sign-up, no watermark, no server: your data never leaves your browser.

![Invoice generator preview](https://invoice.karanchoudhary.dev/opengraph-image)

## Why this exists

My first invoice as a freelancer took longer to figure out than the work it billed: what a SAC code was, whether I needed GST, why TDS made the payment smaller. Generic invoice tools either force GST fields on people who aren't registered, or skip Indian tax rules entirely. This is the tool I wish someone had handed me on day one.

## Features

- **GST handled automatically.** Pick your state and the client's; CGST + SGST or IGST is applied at 18%, with GSTIN, SAC codes, and place of supply where Rule 46 of the CGST Rules expects them.
- **Works without a GSTIN.** Below the ₹20 lakh threshold you don't need GST registration. Choose "Not registered under GST" and get a clean, PAN-based invoice with no tax clutter.
- **Export of services under LUT.** Zero-rated invoices with the exact declaration text, foreign currencies (USD, EUR, GBP and more), and SWIFT details for wire transfers.
- **TDS visibility.** An optional note shows the estimated deduction under Section 194J and the net amount that actually reaches your bank.
- **Real vector PDFs.** Selectable text, embedded Unicode fonts (the ₹ symbol renders correctly), plus PNG export for quick sharing.
- **Indian formatting throughout.** Lakh/crore digit grouping and amount-in-words in the Indian numbering system.
- **Private by design.** Everything is stored in `localStorage`. There is no backend, no account, and no tracking.

## The tax research behind it

The generator implements rules documented in [research.md](./research.md), compiled from primary sources (CBIC, GST Council, GST portal) and rendered as a readable page at [/research](https://invoice.karanchoudhary.dev/research). It covers GST registration thresholds, mandatory Rule 46 invoice fields, TDS under Section 194J, presumptive taxation (44ADA), exports under LUT, and what's compulsory versus optional on a freelancer's invoice.

**This is not tax advice.** Rates and thresholds change with each Budget; verify with a CA before filing.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [@react-pdf/renderer](https://react-pdf.org) for vector PDF generation in the browser
- [html-to-image](https://github.com/bubkoo/html-to-image) for PNG export
- No database, no auth, no API routes — fully static

## Running locally

```bash
git clone https://github.com/karan5772/InvoiceGenerator.git
cd InvoiceGenerator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The production build is `npm run build`.

## Project structure

```
src/
  app/            # Landing page, /invoice generator, /research
  components/     # Form sections, live preview, PDF document, shared header
  lib/            # GST/TDS calculations, amount-in-words, validation, storage
research.md       # The tax & compliance research (single source for /research)
public/fonts/     # Noto Sans TTFs (₹-capable) embedded in generated PDFs
```

## Contributing

Bug reports and pull requests are welcome. If a tax rule changed and the tool is out of date, an issue with a link to the notification is especially appreciated.

## Support

The tool is free and will stay free. If it helped you:

- Star this repo — it helps other freelancers find it
- Share it with someone still making invoices in Word
- Or buy me a chai: UPI `6350320901@ibl`

## License

[MIT](./LICENSE)
