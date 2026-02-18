/**
 * Générateur de vidéos TikTok/Reel automatisé
 * Utilise Puppeteer + ffmpeg pour capturer les animations HTML en vidéo
 * 
 * Usage:
 *   node generate-videos.js                    # Génère toutes les vidéos
 *   node generate-videos.js prog-complete      # Génère une vidéo spécifique
 *   node generate-videos.js --list             # Liste tous les presets disponibles
 * 
 * Prérequis:
 *   - puppeteer (déjà installé)
 *   - ffmpeg installé sur le système (brew install ffmpeg)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');

// Configuration
const CONFIG = {
    width: 1080,
    height: 1920,
    fps: 30,
    duration: 8000, // 8 secondes par vidéo
    outputDir: path.join(__dirname, '../videos'),
    framesDir: path.join(__dirname, '../videos/.frames'),
    generatorUrl: `file://${path.join(__dirname, 'video-generateur-complet.html')}`,
};

// Liste des presets à générer
const ALL_PRESETS = {
    artistes: [
        'cachemire', 'psykup', 'kaminoikari', 'barabbas', 'blackhazard',
        'shaarghot', 'kravboca', 'loudblast', 'akiavel', 'dirtyfonzy', 'breakout',
        'mainkind', 'saintrockstation', 'howlite', 'udap', 'devonduxe'
    ],
    benevoles: ['benev-appel', 'benev-rappel', 'benev-urgence'],
    tremplin: ['tremp-annonce', 'tremp-groupes', 'tremp-j4', 'tremp-resultats'],
    programmation: ['prog-complete', 'prog-vendredi', 'prog-samedi', 'prog-dimanche', 'prog-19'],
    countdown: ['cd-j60', 'cd-j30', 'cd-j15', 'cd-j7', 'cd-j3', 'cd-j1', 'cd-jour-j'],
    billetterie: ['bill-prix', 'bill-pass-ven', 'bill-pass-sam', 'bill-pass-dim', 'bill-urgence', 'bill-afterhell', 'bill-cse'],
    village: ['vill-annonce', 'vill-food', 'vill-barbiers', 'vill-tattoo', 'vill-camping', 'vill-animations', 'vill-kids'],
};

// Vérifier que ffmpeg est installé
function checkFfmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Nettoyer le dossier frames
function cleanFramesDir(presetId) {
    const dir = path.join(CONFIG.framesDir, presetId);
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
    }
    fs.mkdirSync(dir, { recursive: true });
    return dir;
}

// Convertir les frames en vidéo avec ffmpeg
function framesToVideo(framesDir, outputPath, fps) {
    return new Promise((resolve, reject) => {
        const ffmpegArgs = [
            '-y', // Overwrite
            '-framerate', String(fps),
            '-i', path.join(framesDir, 'frame_%04d.png'),
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-crf', '18',
            '-preset', 'fast',
            outputPath
        ];

        const ffmpeg = spawn('ffmpeg', ffmpegArgs, { stdio: 'pipe' });
        
        ffmpeg.on('close', (code) => {
            if (code === 0) {
                resolve(outputPath);
            } else {
                reject(new Error(`ffmpeg exited with code ${code}`));
            }
        });

        ffmpeg.on('error', reject);
    });
}

async function generateVideo(browser, presetId, category = null) {
    console.log(`\n🎬 Génération: ${presetId}`);
    
    const page = await browser.newPage();
    
    // Définir la taille de la fenêtre
    await page.setViewport({
        width: CONFIG.width,
        height: CONFIG.height,
        deviceScaleFactor: 1,
    });

    // Charger la page
    await page.goto(CONFIG.generatorUrl, { waitUntil: 'networkidle0' });

    // Charger le preset
    await page.evaluate((id) => {
        if (typeof loadPreset === 'function') {
            loadPreset(id);
        }
    }, presetId);

    // Attendre que le contenu soit chargé
    await new Promise(r => setTimeout(r, 500));

    // Masquer les contrôles et ne garder que la vidéo
    await page.evaluate(() => {
        const controls = document.querySelector('.controls');
        if (controls) controls.style.display = 'none';
        
        const previewInfo = document.querySelector('.preview-info');
        if (previewInfo) previewInfo.style.display = 'none';
        
        const exportNotice = document.querySelector('.export-notice');
        if (exportNotice) exportNotice.style.display = 'none';
        
        const previewArea = document.querySelector('.preview-area');
        if (previewArea) {
            previewArea.style.padding = '0';
            previewArea.style.display = 'flex';
            previewArea.style.alignItems = 'center';
            previewArea.style.justifyContent = 'center';
        }
        
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.style.width = '100vw';
            videoContainer.style.height = '100vh';
            videoContainer.style.border = 'none';
            videoContainer.style.borderRadius = '0';
        }
    });

    // Créer les dossiers
    const categoryDir = category ? path.join(CONFIG.outputDir, category) : CONFIG.outputDir;
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const framesDir = cleanFramesDir(presetId);
    const outputPath = path.join(categoryDir, `${presetId}.mp4`);

    // Rejouer l'animation
    await page.evaluate(() => {
        if (typeof replayAnimation === 'function') {
            replayAnimation();
        }
    });

    console.log(`   ⏺️  Capture des frames...`);

    // Capturer les frames
    const totalFrames = Math.ceil((CONFIG.duration / 1000) * CONFIG.fps);
    const frameInterval = 1000 / CONFIG.fps;

    for (let i = 0; i < totalFrames; i++) {
        const framePath = path.join(framesDir, `frame_${String(i).padStart(4, '0')}.png`);
        await page.screenshot({ path: framePath, type: 'png' });
        
        if (i < totalFrames - 1) {
            await new Promise(r => setTimeout(r, frameInterval));
        }
        
        // Afficher la progression
        if (i % 30 === 0) {
            process.stdout.write(`\r   ⏺️  Capture: ${Math.round((i / totalFrames) * 100)}%`);
        }
    }
    
    console.log(`\r   ⏺️  Capture: 100%`);
    console.log(`   🎞️  Encodage vidéo...`);

    // Convertir en vidéo
    await framesToVideo(framesDir, outputPath, CONFIG.fps);

    // Nettoyer les frames
    fs.rmSync(framesDir, { recursive: true });

    console.log(`   ✅ Sauvegardé: ${outputPath}`);

    await page.close();
    return outputPath;
}

async function generateAllVideos(categories = null, presets = null) {
    console.log('🚀 Générateur de vidéos Barb\'n\'Rock\n');
    console.log(`📐 Format: ${CONFIG.width}x${CONFIG.height} (9:16)`);
    console.log(`🎞️  FPS: ${CONFIG.fps}`);
    console.log(`⏱️  Durée: ${CONFIG.duration / 1000}s par vidéo`);
    console.log(`📁 Sortie: ${CONFIG.outputDir}\n`);

    // Vérifier ffmpeg
    if (!checkFfmpeg()) {
        console.error('❌ ffmpeg non trouvé. Installe-le avec:');
        console.error('   brew install ffmpeg');
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            `--window-size=${CONFIG.width},${CONFIG.height}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });

    const generatedVideos = [];

    try {
        if (presets && presets.length > 0) {
            for (const presetId of presets) {
                try {
                    const videoPath = await generateVideo(browser, presetId);
                    generatedVideos.push(videoPath);
                } catch (error) {
                    console.error(`   ❌ Erreur pour ${presetId}:`, error.message);
                }
            }
        } else {
            const categoriesToGenerate = categories || Object.keys(ALL_PRESETS);
            
            for (const category of categoriesToGenerate) {
                if (!ALL_PRESETS[category]) {
                    console.warn(`⚠️  Catégorie inconnue: ${category}`);
                    continue;
                }

                console.log(`\n📂 Catégorie: ${category.toUpperCase()}`);
                
                for (const presetId of ALL_PRESETS[category]) {
                    try {
                        const videoPath = await generateVideo(browser, presetId, category);
                        generatedVideos.push(videoPath);
                    } catch (error) {
                        console.error(`   ❌ Erreur pour ${presetId}:`, error.message);
                    }
                }
            }
        }
    } finally {
        await browser.close();
    }

    // Nettoyer le dossier frames
    if (fs.existsSync(CONFIG.framesDir)) {
        fs.rmSync(CONFIG.framesDir, { recursive: true });
    }

    console.log(`\n\n✨ Génération terminée!`);
    console.log(`📊 ${generatedVideos.length} vidéos générées`);
    
    return generatedVideos;
}

function listPresets() {
    console.log('\n📋 Presets disponibles:\n');
    
    for (const [category, presets] of Object.entries(ALL_PRESETS)) {
        console.log(`  ${category.toUpperCase()}:`);
        presets.forEach(p => console.log(`    - ${p}`));
        console.log('');
    }
    
    const total = Object.values(ALL_PRESETS).flat().length;
    console.log(`Total: ${total} presets\n`);
}

// CLI
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--list') || args.includes('-l')) {
        listPresets();
        return;
    }

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Générateur de vidéos TikTok/Reel - Barb'n'Rock 2026

Usage:
  node generate-videos.js                     Génère toutes les vidéos
  node generate-videos.js <preset>            Génère une vidéo spécifique
  node generate-videos.js --category <cat>    Génère une catégorie
  node generate-videos.js --list              Liste tous les presets
  node generate-videos.js --help              Affiche cette aide

Catégories: artistes, benevoles, tremplin, programmation, countdown, billetterie, village

Prérequis:
  - ffmpeg (brew install ffmpeg)

Exemples:
  node generate-videos.js prog-complete
  node generate-videos.js --category artistes
  node generate-videos.js shaarghot loudblast psykup
        `);
        return;
    }

    if (args.includes('--category') || args.includes('-c')) {
        const catIndex = args.findIndex(a => a === '--category' || a === '-c');
        const categories = args.slice(catIndex + 1).filter(a => !a.startsWith('-'));
        await generateAllVideos(categories);
    } else if (args.length > 0) {
        await generateAllVideos(null, args);
    } else {
        await generateAllVideos();
    }
}

main().catch(console.error);
