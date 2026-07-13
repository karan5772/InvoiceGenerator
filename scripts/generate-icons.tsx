/**
 * Generates all favicon/app-icon assets from the brand mark.
 * Run: npx tsx scripts/generate-icons.tsx
 *
 * Outputs:
 *   src/app/favicon.ico      48x48 (PNG-in-ICO) — Google requires 48px multiples
 *   src/app/icon.png         96x96 browser favicon
 *   src/app/apple-icon.png   180x180 iOS home-screen icon
 *   public/icon-192.png      web app manifest
 *   public/icon-512.png      web app manifest
 */
import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");

function Mark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        borderRadius: Math.round(size * 0.22),
      }}
    >
      <svg
        width={Math.round(size * 0.62)}
        height={Math.round(size * 0.62)}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M10 7h12v18l-3.3-2L16 25l-2.7-2L10 25V7Z"
          stroke="#ffffff"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

async function renderPng(size: number): Promise<Buffer> {
  const res = new ImageResponse(<Mark size={size} />, { width: size, height: size });
  return Buffer.from(await res.arrayBuffer());
}

// Modern .ico container holding a single PNG entry.
function icoFromPng(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size; // width
  entry[1] = size >= 256 ? 0 : size; // height
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // image data size
  entry.writeUInt32LE(22, 12); // data offset (6 + 16)

  return Buffer.concat([header, entry, png]);
}

async function main() {
  const out: Array<[string, Buffer]> = [
    ["src/app/favicon.ico", icoFromPng(await renderPng(48), 48)],
    ["src/app/icon.png", await renderPng(96)],
    ["src/app/apple-icon.png", await renderPng(180)],
    ["public/icon-192.png", await renderPng(192)],
    ["public/icon-512.png", await renderPng(512)],
  ];
  for (const [rel, buf] of out) {
    fs.writeFileSync(path.join(ROOT, rel), buf);
    console.log(`wrote ${rel} (${buf.length} bytes)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
