import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/images/posts/tatoueurs-village-2026.png');
const BG = path.join(ROOT, 'public/images/hero-visual.jpg');

const ARTISTS = [
  {
    name: 'José Martinez',
    url: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776281839289.png',
  },
  {
    name: 'Ink Dreamer',
    url: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776282672533.jpeg',
  },
  {
    name: 'MJA Tattoo',
    url: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1776282719769.jpeg',
  },
  {
    name: "Moog's Ink Tattoo",
    url: 'https://iks0xxkxqmnlh62j.public.blob.vercel-storage.com/village/1777491842803.jpg',
  },
];

const SIZE = 1080;
const CARD_W = 440;
const CARD_H = 260;
const LOGO_W = 400;
const LOGO_H = 200;

const GRID = [
  { x: 60, y: 340, nameX: 280, nameY: 630 },
  { x: 580, y: 340, nameX: 800, nameY: 630 },
  { x: 60, y: 660, nameX: 280, nameY: 950 },
  { x: 580, y: 660, nameX: 800, nameY: 950 },
];

async function fetchLogoBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function escapeXml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildCardSvg() {
  return Buffer.from(`
    <svg width="${CARD_W}" height="${CARD_H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${CARD_W}" height="${CARD_H}" rx="16" fill="#ffffff" stroke="#00E5CC" stroke-width="3"/>
    </svg>
  `);
}

function buildHeaderSvg() {
  return Buffer.from(`
    <svg width="${SIZE}" height="330" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a0c0f" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#0a0c0f" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="330" fill="url(#topFade)"/>
      <rect x="52" y="52" width="200" height="44" rx="4" fill="#E85D04" transform="rotate(-2 152 74)"/>
      <text x="68" y="80" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="22" letter-spacing="3">AU VILLAGE</text>
      <text x="540" y="175" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="92" letter-spacing="4">FLASH</text>
      <text x="540" y="265" text-anchor="middle" fill="#00E5CC" font-family="Arial Black, Impact, sans-serif" font-size="92" letter-spacing="4">TATTOO</text>
      <text x="540" y="310" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600">4 artistes sur place tout le week-end</text>
    </svg>
  `);
}

function buildNamesSvg() {
  const nameLabels = ARTISTS.map(
    (artist, i) =>
      `<text x="${GRID[i].nameX}" y="${GRID[i].nameY}" text-anchor="middle" fill="#ffffff" stroke="#0a0c0f" stroke-width="4" paint-order="stroke" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">${escapeXml(artist.name)}</text>`,
  ).join('\n');

  return Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      ${nameLabels}
    </svg>
  `);
}

function buildFooterSvg() {
  return Buffer.from(`
    <svg width="${SIZE}" height="120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a0c0f" stop-opacity="0"/>
          <stop offset="100%" stop-color="#0a0c0f" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="120" fill="url(#bottomFade)"/>
      <text x="540" y="50" text-anchor="middle" fill="#ffffff" stroke="#0a0c0f" stroke-width="3" paint-order="stroke" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">26 · 27 · 28 JUIN 2026</text>
      <text x="540" y="90" text-anchor="middle" fill="#00E5CC" stroke="#0a0c0f" stroke-width="2" paint-order="stroke" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600">CRÈVECOEUR-LE-GRAND · BARB&apos;N&apos;ROCK</text>
    </svg>
  `);
}

async function prepareLogo(url) {
  const buffer = await fetchLogoBuffer(url);
  return sharp(buffer)
    .resize(LOGO_W, LOGO_H, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const background = await sharp(BG)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .toBuffer();

  const cardBuffer = await sharp(buildCardSvg()).png().toBuffer();
  const headerBuffer = await sharp(buildHeaderSvg()).png().toBuffer();
  const namesBuffer = await sharp(buildNamesSvg()).png().toBuffer();
  const footerBuffer = await sharp(buildFooterSvg()).png().toBuffer();
  const logos = await Promise.all(ARTISTS.map((a) => prepareLogo(a.url)));

  const composites = [
    { input: headerBuffer, left: 0, top: 0 },
  ];

  for (const { x, y } of GRID) {
    composites.push({ input: cardBuffer, left: x, top: y });
  }

  GRID.forEach(({ x, y }, i) => {
    composites.push({
      input: logos[i],
      left: x + Math.round((CARD_W - LOGO_W) / 2),
      top: y + Math.round((CARD_H - LOGO_H) / 2),
    });
  });

  composites.push({ input: namesBuffer, left: 0, top: 0 });
  composites.push({ input: footerBuffer, left: 0, top: 960 });

  await sharp(background).composite(composites).png().toFile(OUT);

  console.log(`Image générée : ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
