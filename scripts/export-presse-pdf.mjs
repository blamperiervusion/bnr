/**
 * Export the /presse slideshow as a PDF.
 * Usage: node scripts/export-presse-pdf.mjs
 * Requires the Next.js dev server to be running on http://localhost:3000
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE_URL = 'http://localhost:3000/presse';
const OUT_FILE = join(ROOT, 'private', 'export-conference-presse-barbnrock-2026.pdf');

// Must match the order in app/presse/page.tsx → SLIDES
const SLIDE_COUNT = 11;

async function main() {
  console.log('🚀 Lancement de Puppeteer…');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Largeur A4 portrait à 150 % de zoom (~900 px)
  await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });

  console.log(`📄 Ouverture de ${BASE_URL}…`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30_000 });

  // Injecte du CSS pour libérer la hauteur fixe et laisser le contenu s'étendre
  await page.addStyleTag({ content: `
    /* retire le conteneur hauteur-fixe pour export PDF */
    html, body { height: auto !important; overflow: visible !important; }
    [style*="100dvh"] { height: auto !important; overflow: visible !important; }
    /* barre de progression + header : on garde, juste plus de clip */
    .flex-1.min-h-0.overflow-y-auto {
      overflow: visible !important;
      height: auto !important;
      min-height: 0 !important;
      flex: none !important;
    }
    /* cache nav arrows et dots inutiles en PDF */
    button[disabled], button:has(+ button) { display: none !important; }
  ` });

  // Wait for first slide to be fully rendered
  await new Promise(r => setTimeout(r, 1500));

  const screenshots = [];

  for (let i = 0; i < SLIDE_COUNT; i++) {
    console.log(`📸 Capture slide ${i + 1}/${SLIDE_COUNT}…`);

    // Wait for images to settle
    await new Promise(r => setTimeout(r, 900));

    const shot = await page.screenshot({ type: 'png', fullPage: true });
    screenshots.push(shot);

    if (i < SLIDE_COUNT - 1) {
      await page.keyboard.press('ArrowRight');
    }
  }

  await browser.close();
  console.log('✅ Captures terminées, génération du PDF…');

  // Use a second Puppeteer instance to assemble screenshots into a PDF
  const browser2 = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const pdfPage = await browser2.newPage();
  await pdfPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  // Build an HTML page with one slide per @page — portrait A4
  const imagesHtml = screenshots
    .map((buf, i) => {
      const b64 = buf.toString('base64');
      return `<div class="slide" id="slide-${i}">
        <img src="data:image/png;base64,${b64}" />
      </div>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; }
  .slide {
    width: 210mm;
    page-break-after: always;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .slide:last-child { page-break-after: avoid; }
  .slide img {
    width: 210mm;
    height: auto;
    display: block;
  }
  @page {
    size: 210mm auto;
    margin: 0;
  }
</style>
</head>
<body>
${imagesHtml}
</body>
</html>`;

  await pdfPage.setContent(html, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  const pdf = await pdfPage.pdf({
    path: OUT_FILE,
    format: undefined,
    width: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser2.close();

  console.log(`\n✅ PDF généré : ${OUT_FILE}`);
  console.log(`   ${SLIDE_COUNT} slides · format 16:9 (A4 paysage)`);
}

main().catch(err => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});
