const puppeteer = require('puppeteer');
const path = require('path');

async function generateFlyersPDF() {
  console.log('🎸 Génération des flyers A5 en PDF...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, 'flyers-a5.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  // Attendre que les images soient chargées
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // ===== FLYER 1 : CHAOS =====
  await page.evaluate(() => {
    const flyerWrappers = document.querySelectorAll('.flyer-wrapper');
    flyerWrappers.forEach((wrapper, index) => {
      if (index !== 0) wrapper.style.display = 'none';
    });
    document.querySelector('h1').style.display = 'none';
    document.querySelector('.subtitle').style.display = 'none';
    document.querySelector('.instructions').style.display = 'none';
    document.querySelector('.flyer-label').style.display = 'none';
    document.body.style.padding = '0';
    document.body.style.background = 'white';
    document.querySelector('.flyers-container').style.padding = '0';
    document.querySelector('.flyers-container').style.gap = '0';
  });
  
  await page.pdf({
    path: path.resolve(__dirname, '../pdf/flyer-chaos.pdf'),
    width: '148mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false
  });
  
  console.log('✓ Flyer Chaos → flyer-chaos.pdf');
  
  // ===== FLYER 2 : FAMILLE =====
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await page.evaluate(() => {
    const flyerWrappers = document.querySelectorAll('.flyer-wrapper');
    flyerWrappers.forEach((wrapper, index) => {
      if (index !== 1) wrapper.style.display = 'none';
    });
    document.querySelector('h1').style.display = 'none';
    document.querySelector('.subtitle').style.display = 'none';
    document.querySelector('.instructions').style.display = 'none';
    const labels = document.querySelectorAll('.flyer-label');
    labels.forEach(l => l.style.display = 'none');
    document.body.style.padding = '0';
    document.body.style.background = 'white';
    document.querySelector('.flyers-container').style.padding = '0';
    document.querySelector('.flyers-container').style.gap = '0';
  });
  
  await page.pdf({
    path: path.resolve(__dirname, '../pdf/flyer-famille.pdf'),
    width: '148mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false
  });
  
  console.log('✓ Flyer Famille → flyer-famille.pdf');
  
  // ===== FLYER COMBINÉ =====
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await page.evaluate(() => {
    document.querySelector('h1').style.display = 'none';
    document.querySelector('.subtitle').style.display = 'none';
    document.querySelector('.instructions').style.display = 'none';
    document.querySelectorAll('.flyer-label').forEach(l => l.style.display = 'none');
    document.body.style.padding = '0';
    document.body.style.background = 'white';
    
    const container = document.querySelector('.flyers-container');
    container.style.display = 'block';
    container.style.padding = '0';
    
    document.querySelectorAll('.flyer-wrapper').forEach((wrapper) => {
      wrapper.style.pageBreakAfter = 'always';
      wrapper.style.display = 'flex';
      wrapper.style.justifyContent = 'center';
      wrapper.style.alignItems = 'center';
      wrapper.style.height = '210mm';
      wrapper.style.width = '148mm';
      wrapper.style.margin = '0';
      wrapper.style.padding = '0';
    });
    
    document.querySelectorAll('.flyer').forEach(flyer => {
      flyer.style.width = '148mm';
      flyer.style.height = '210mm';
      flyer.style.boxShadow = 'none';
    });
  });
  
  await page.pdf({
    path: path.resolve(__dirname, '../pdf/flyers-a5-complet.pdf'),
    width: '148mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false
  });
  
  console.log('✓ Flyers combinés → flyers-a5-complet.pdf');
  
  await browser.close();
  console.log('\n🤘 Terminé ! 3 PDFs générés dans /communication/pdf/');
}

generateFlyersPDF().catch(console.error);
