import { readFile, writeFile } from "node:fs/promises";
import subsetFont from "subset-font";

const [source, output] = process.argv.slice(2);

if (!source || !output) {
  throw new Error("Usage: node scripts/subset-font.mjs SOURCE OUTPUT");
}

const glyphs = String.fromCodePoint(
  ...Array.from({ length: 0xE0 }, (_, index) => index + 0x20),
  0x2013,
  0x2014,
  0x2018,
  0x2019,
  0x201A,
  0x201B,
  0x201C,
  0x201D,
  0x201E,
  0x201F,
  0x2026,
  0x2192,
  0x2194,
  0x2212,
  0x2580,
  0x2584,
  0x2588,
);

const input = await readFile(source);
const outputFont = await subsetFont(input, glyphs, { targetFormat: "woff2" });
await writeFile(output, outputFont);
