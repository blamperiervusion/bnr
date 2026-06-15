import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/images/posts/covoiturage-2026.png');
const BG = path.join(ROOT, 'public/images/hero-visual.jpg');

const SIZE = 1080;

function buildOverlaySvg() {
  return Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a0c0f" stop-opacity="0.92"/>
          <stop offset="55%" stop-color="#0a0c0f" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#0a0c0f" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect width="${SIZE}" height="${SIZE}" fill="url(#bgFade)"/>
    </svg>
  `);
}

function buildContentSvg() {
  return Buffer.from(`
    <svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pinGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Badge top left -->
      <rect x="52" y="52" width="256" height="44" rx="4" fill="#E85D04" transform="rotate(-2 180 74)"/>
      <text x="68" y="80" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="22" letter-spacing="3">BARB&apos;N&apos;ROCK 2026</text>

      <!-- Main title -->
      <text x="540" y="195" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="102" letter-spacing="4">COVOITURAGE</text>

      <!-- Subtitle -->
      <text x="540" y="248" text-anchor="middle" fill="#00E5CC" font-family="Arial Black, Impact, sans-serif" font-size="33" letter-spacing="2">PROPOSE OU TROUVE TON TRAJET</text>

      <!-- Tagline -->
      <text x="540" y="288" text-anchor="middle" fill="#b0b0b0" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500">La page est disponible sur barbnrock-festival.fr</text>

      <!-- Map pin above car -->
      <circle cx="540" cy="335" r="32" fill="#E85D04" filter="url(#pinGlow)"/>
      <circle cx="540" cy="335" r="32" fill="#E85D04"/>
      <circle cx="540" cy="335" r="14" fill="#ffffff"/>
      <circle cx="540" cy="335" r="6" fill="#E85D04"/>
      <path d="M 527 362 Q 540 390 553 362 Z" fill="#E85D04"/>
      <!-- Dashed line from pin to car roof -->
      <line x1="540" y1="393" x2="540" y2="415" stroke="#E85D04" stroke-width="3" stroke-dasharray="4 3" stroke-opacity="0.55"/>

      <!-- ═══ CAR SIDE VIEW ═══ -->

      <!-- Main body silhouette -->
      <path d="
        M 178 540
        Q 175 516 192 503
        L 338 460
        Q 368 428 398 415
        L 685 415
        Q 716 428 753 463
        L 878 497
        Q 908 510 912 534
        L 912 540 Z
      " fill="#1a1c2e" stroke="#00E5CC" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>

      <!-- Undercarriage bar -->
      <rect x="196" y="540" width="698" height="20" rx="4" fill="#1a1c2e" stroke="#00E5CC" stroke-width="3"/>

      <!-- Front windshield -->
      <path d="M 685 415 L 753 463 L 553 463 L 553 415 Z"
        fill="#00E5CC" fill-opacity="0.13" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.7"/>

      <!-- Main side window -->
      <path d="M 406 415 L 546 415 L 546 463 L 396 463 Z"
        fill="#00E5CC" fill-opacity="0.13" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.7"/>

      <!-- Rear quarter window -->
      <path d="M 338 460 Q 368 428 398 415 L 404 415 L 394 463 L 335 463 Z"
        fill="#00E5CC" fill-opacity="0.08" stroke="#00E5CC" stroke-width="1.5" stroke-opacity="0.5"/>

      <!-- B-pillar -->
      <rect x="549" y="415" width="8" height="48" fill="#1a1c2e"/>

      <!-- Door crease line -->
      <line x1="325" y1="502" x2="870" y2="502" stroke="#00E5CC" stroke-width="1.5" stroke-opacity="0.22"/>
      <line x1="549" y1="463" x2="549" y2="542" stroke="#00E5CC" stroke-width="1.5" stroke-opacity="0.22"/>

      <!-- Headlight (front = right) -->
      <path d="M 878 500 Q 912 506 912 530 L 912 538 L 873 538 L 868 512 Q 870 498 878 500 Z"
        fill="#E85D04" fill-opacity="0.88"/>
      <line x1="875" y1="509" x2="908" y2="519" stroke="#fff" stroke-width="2" stroke-opacity="0.45"/>
      <line x1="875" y1="519" x2="908" y2="528" stroke="#fff" stroke-width="1.5" stroke-opacity="0.28"/>

      <!-- Taillight (rear = left) -->
      <path d="M 183 506 Q 175 512 175 530 L 175 538 L 200 538 L 200 506 Z"
        fill="#E85D04" fill-opacity="0.72"/>

      <!-- Exhaust pipe -->
      <rect x="216" y="554" width="30" height="8" rx="4" fill="#2a2a2a" stroke="#444" stroke-width="1"/>

      <!-- Rear wheel arch (covers body bottom) -->
      <path d="M 242 562 Q 242 510 310 507 Q 378 510 378 562"
        fill="#1a1c2e" stroke="#1a1c2e" stroke-width="4"/>
      <!-- Front wheel arch -->
      <path d="M 673 562 Q 673 510 742 507 Q 810 510 810 562"
        fill="#1a1c2e" stroke="#1a1c2e" stroke-width="4"/>

      <!-- Rear wheel -->
      <circle cx="310" cy="577" r="54" fill="#0a0c0f" stroke="#00E5CC" stroke-width="5"/>
      <circle cx="310" cy="577" r="32" fill="#141625" stroke="#00E5CC" stroke-width="3"/>
      <line x1="310" y1="545" x2="310" y2="609" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="278" y1="577" x2="342" y2="577" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="287" y1="554" x2="333" y2="600" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="333" y1="554" x2="287" y2="600" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <circle cx="310" cy="577" r="9" fill="#00E5CC"/>

      <!-- Front wheel -->
      <circle cx="742" cy="577" r="54" fill="#0a0c0f" stroke="#00E5CC" stroke-width="5"/>
      <circle cx="742" cy="577" r="32" fill="#141625" stroke="#00E5CC" stroke-width="3"/>
      <line x1="742" y1="545" x2="742" y2="609" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="710" y1="577" x2="774" y2="577" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="719" y1="554" x2="765" y2="600" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="765" y1="554" x2="719" y2="600" stroke="#00E5CC" stroke-width="2" stroke-opacity="0.4"/>
      <circle cx="742" cy="577" r="9" fill="#00E5CC"/>

      <!-- Ground shadow -->
      <ellipse cx="540" cy="643" rx="390" ry="9" fill="#00E5CC" fill-opacity="0.05"/>
      <line x1="90" y1="636" x2="990" y2="636" stroke="#00E5CC" stroke-width="1" stroke-opacity="0.1"/>

      <!-- URL banner -->
      <rect x="180" y="718" width="720" height="78" rx="16" fill="#E85D04"/>
      <text x="540" y="766" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="30" letter-spacing="1">barbnrock-festival.fr/covoiturage</text>

      <!-- Footer -->
      <text x="540" y="876" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">26 · 27 · 28 JUIN 2026</text>
      <text x="540" y="918" text-anchor="middle" fill="#00E5CC" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600">CRÈVECOEUR-LE-GRAND · BARB&apos;N&apos;ROCK</text>
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
