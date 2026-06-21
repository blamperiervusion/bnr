import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/images/posts/association-fees-sourires-2026.png');
const BG = path.join(ROOT, 'public/images/hero-visual.jpg');

const SIZE = 1080;

function buildOverlaySvg() {
  return Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a0c0f" stop-opacity="0.88"/>
          <stop offset="45%" stop-color="#0a0c0f" stop-opacity="0.80"/>
          <stop offset="100%" stop-color="#0a0c0f" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#bgFade)"/>
    </svg>
  `);
}

function buildContentSvg() {
  const descLine1 = 'Améliorer la qualité de vie des enfants';
  const descLine2 = 'hospitalisés et de leurs familles : jeux,';
  const descLine3 = 'animations, présence dans les services.';

  return Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">

      <!-- Badge top left -->
      <rect x="52" y="52" width="282" height="44" rx="4" fill="#E85D04" transform="rotate(-2 193 74)"/>
      <text x="68" y="80" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="22" letter-spacing="3">BARB&apos;N&apos;ROCK 2026</text>

      <!-- Badge top right -->
      <rect x="700" y="52" width="328" height="44" rx="4" fill="#E85D04" transform="rotate(2 864 74)"/>
      <text x="716" y="80" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="22" letter-spacing="2">26 · 27 · 28 JUIN 2026</text>

      <!-- Heart icon area -->
      <text x="540" y="210" text-anchor="middle" font-size="110">🧸</text>

      <!-- Label above title -->
      <text x="540" y="295" text-anchor="middle" fill="#E85D04" font-family="Arial Black, Impact, sans-serif" font-size="22" letter-spacing="5">ASSOCIATION DE L&apos;ANNÉE</text>

      <!-- Divider -->
      <line x1="140" y1="315" x2="940" y2="315" stroke="#E85D04" stroke-width="2" stroke-opacity="0.5"/>

      <!-- Association name -->
      <text x="540" y="400" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="82" letter-spacing="2">LES FÉES</text>
      <text x="540" y="490" text-anchor="middle" fill="#E85D04" font-family="Arial Black, Impact, sans-serif" font-size="82" letter-spacing="2">SOURIRES</text>

      <!-- Description -->
      <text x="540" y="545" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400">${descLine1}</text>
      <text x="540" y="578" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400">${descLine2}</text>
      <text x="540" y="611" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400">${descLine3}</text>

      <!-- Divider -->
      <line x1="140" y1="643" x2="940" y2="643" stroke="#E85D04" stroke-width="2" stroke-opacity="0.5"/>

      <!-- Solidarity info boxes -->
      <!-- Box 1: 10% des ventes -->
      <rect x="80" y="668" width="420" height="130" rx="16" fill="#E85D04" fill-opacity="0.15" stroke="#E85D04" stroke-width="2"/>
      <text x="290" y="718" text-anchor="middle" fill="#E85D04" font-family="Arial Black, Impact, sans-serif" font-size="38" letter-spacing="1">10% DES VENTES</text>
      <text x="290" y="750" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="22">reversés par chaque stand</text>
      <text x="290" y="778" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="22">du Village du Chaos</text>

      <!-- Box 2: Tombola -->
      <rect x="580" y="668" width="420" height="130" rx="16" fill="#00E5CC" fill-opacity="0.10" stroke="#00E5CC" stroke-width="2"/>
      <text x="790" y="718" text-anchor="middle" fill="#00E5CC" font-family="Arial Black, Impact, sans-serif" font-size="38" letter-spacing="1">TOMBOLA</text>
      <text x="790" y="750" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="22">gains intégralement reversés</text>
      <text x="790" y="778" text-anchor="middle" fill="#d0d0d0" font-family="Arial, Helvetica, sans-serif" font-size="22">à l&apos;association</text>

      <!-- Instagram handle -->
      <text x="540" y="862" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700">📷 @association.les.fees.sourires</text>

      <!-- Divider -->
      <line x1="140" y1="890" x2="940" y2="890" stroke="#E85D04" stroke-width="2" stroke-opacity="0.4"/>

      <!-- Footer -->
      <text x="540" y="948" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">SOLIDAIRES &amp; EN METAL !</text>
      <text x="540" y="990" text-anchor="middle" fill="#00E5CC" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600">CRÈVECOEUR-LE-GRAND · BARB&apos;N&apos;ROCK</text>
    </svg>
  `);
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const background = await sharp(BG)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .toBuffer();

  const overlayBuffer = await sharp(buildOverlaySvg()).png().toBuffer();
  const contentBuffer = await sharp(buildContentSvg()).png().toBuffer();

  await sharp(background)
    .composite([
      { input: overlayBuffer, left: 0, top: 0 },
      { input: contentBuffer, left: 0, top: 0 },
    ])
    .png()
    .toFile(OUT);

  console.log(`Image générée : ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
