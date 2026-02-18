const puppeteer = require('puppeteer');
const path = require('path');

const documents = [
  { name: 'bilan-2025', title: 'Bilan 2025' }
];

async function generatePDF(browser, docName) {
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, `${docName}.html`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  // Injecter du CSS pour supprimer toutes les marges d'impression
  await page.addStyleTag({
    content: `
      @page {
        margin: 0 !important;
        padding: 0 !important;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
    `
  });
  
  await page.pdf({
    path: path.resolve(__dirname, `${docName}.pdf`),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false
  });
  
  await page.close();
}

(async () => {
  const args = process.argv.slice(2);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Si un argument est passé, générer uniquement ce document
  if (args.length > 0) {
    const docName = args[0];
    const doc = documents.find(d => d.name === docName);
    if (doc) {
      await generatePDF(browser, doc.name);
      console.log(`✓ ${doc.title} → ${doc.name}.pdf`);
    } else {
      console.log(`Document inconnu: ${docName}`);
      console.log('Documents disponibles:', documents.map(d => d.name).join(', '));
    }
  } else {
    // Générer tous les documents
    console.log('Génération de tous les PDFs...\n');
    for (const doc of documents) {
      await generatePDF(browser, doc.name);
      console.log(`✓ ${doc.title} → ${doc.name}.pdf`);
    }
  }
  
  await browser.close();
  console.log('\nTerminé !');
})();
