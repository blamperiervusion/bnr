const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/images/logo.png');
const publicPath = path.join(__dirname, '../public');
const appPath = path.join(__dirname, '../app');

async function generateFavicons() {
  console.log('Génération des favicons...\n');

  // Créer les différentes tailles
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  for (const { name, size } of sizes) {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicPath, name));
    console.log(`✓ ${name} (${size}x${size})`);
  }

  // Créer le favicon.ico (utilise le 32x32)
  // Note: sharp ne génère pas directement .ico, on copie le 32x32 comme base
  // Pour un vrai .ico, on utiliserait png-to-ico ou similaire
  await sharp(inputPath)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(appPath, 'icon.png'));
  console.log('✓ app/icon.png (32x32)');

  // Créer aussi une version pour l'app folder
  await sharp(inputPath)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(appPath, 'apple-icon.png'));
  console.log('✓ app/apple-icon.png (180x180)');

  console.log('\n✅ Favicons générés avec succès !');
}

generateFavicons().catch(console.error);
