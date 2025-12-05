const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'pwa-assets');

// Create assets directory
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Icon sizes needed for Play Store / PWA
const iconSizes = [48, 72, 96, 144, 192, 512];

// Create a beautiful gradient icon with "N"
async function createIcon(size) {
  // Create SVG with gradient background and "N" letter
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1"/>
          <stop offset="100%" style="stop-color:#4f46e5"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle">N</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(assetsDir, `icon-${size}.png`));

  console.log(`Created icon-${size}.png`);
}

// Create feature graphic (1024x500)
async function createFeatureGraphic() {
  const width = 1024;
  const height = 500;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5"/>
          <stop offset="50%" style="stop-color:#6366f1"/>
          <stop offset="100%" style="stop-color:#818cf8"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">Nandini AI</text>
      <text x="50%" y="58%" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.9)" text-anchor="middle">Learn Step by Step with AI</text>
      <text x="50%" y="72%" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle">Socratic Method Tutoring</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(assetsDir, 'feature-graphic.png'));

  console.log('Created feature-graphic.png (1024x500)');
}

// Create phone screenshot mockup
async function createScreenshot(num, title, subtitle) {
  const width = 1080;
  const height = 1920;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg${num}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc"/>
          <stop offset="100%" style="stop-color:#e2e8f0"/>
        </linearGradient>
      </defs>
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg${num})"/>

      <!-- Status bar -->
      <rect width="${width}" height="80" fill="#4f46e5"/>

      <!-- Header -->
      <rect y="80" width="${width}" height="120" fill="#4f46e5"/>
      <text x="50%" y="160" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">Nandini AI</text>

      <!-- Content area with rounded card -->
      <rect x="40" y="280" width="${width - 80}" height="400" rx="24" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"/>
      <text x="50%" y="420" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#1e293b" text-anchor="middle">${title}</text>
      <text x="50%" y="500" font-family="Arial, sans-serif" font-size="28" fill="#64748b" text-anchor="middle">${subtitle}</text>

      <!-- Step cards -->
      <rect x="40" y="760" width="${width - 80}" height="160" rx="16" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))"/>
      <circle cx="120" cy="840" r="32" fill="#4f46e5"/>
      <text x="120" y="852" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">1</text>
      <text x="200" y="830" font-family="Arial, sans-serif" font-size="28" fill="#1e293b">Step 1: Think about it...</text>
      <text x="200" y="870" font-family="Arial, sans-serif" font-size="22" fill="#64748b">Tap to reveal the answer</text>

      <rect x="40" y="960" width="${width - 80}" height="160" rx="16" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))"/>
      <circle cx="120" cy="1040" r="32" fill="#10b981"/>
      <text x="120" y="1052" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">2</text>
      <text x="200" y="1030" font-family="Arial, sans-serif" font-size="28" fill="#1e293b">Step 2: Apply the formula</text>
      <text x="200" y="1070" font-family="Arial, sans-serif" font-size="22" fill="#64748b">Answer revealed!</text>

      <rect x="40" y="1160" width="${width - 80}" height="160" rx="16" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))"/>
      <circle cx="120" cy="1240" r="32" fill="#6366f1" opacity="0.5"/>
      <text x="120" y="1252" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">3</text>
      <text x="200" y="1230" font-family="Arial, sans-serif" font-size="28" fill="#1e293b">Step 3: Calculate result</text>
      <text x="200" y="1270" font-family="Arial, sans-serif" font-size="22" fill="#64748b">Tap to reveal</text>

      <!-- Bottom input -->
      <rect x="40" y="${height - 200}" width="${width - 80}" height="100" rx="50" fill="white" stroke="#e2e8f0" stroke-width="2"/>
      <text x="100" y="${height - 140}" font-family="Arial, sans-serif" font-size="28" fill="#94a3b8">Ask any question...</text>

      <!-- Feature badge -->
      <rect x="${width - 300}" y="${height - 180}" width="240" height="60" rx="30" fill="#4f46e5"/>
      <text x="${width - 180}" y="${height - 140}" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Ask AI</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(assetsDir, `screenshot-${num}.png`));

  console.log(`Created screenshot-${num}.png (1080x1920)`);
}

async function main() {
  console.log('Generating PWA/Play Store assets...\n');

  // Generate all icon sizes
  for (const size of iconSizes) {
    await createIcon(size);
  }

  // Generate feature graphic
  await createFeatureGraphic();

  // Generate screenshots
  await createScreenshot(1, 'Ask Any Question', 'Get step-by-step explanations');
  await createScreenshot(2, 'Learn by Doing', 'Think before revealing answers');
  await createScreenshot(3, 'Math Made Easy', 'Beautiful formula rendering');

  console.log(`\nAll assets saved to: ${assetsDir}`);
  console.log('\nAssets created:');
  console.log('- icon-48.png through icon-512.png (App icons)');
  console.log('- feature-graphic.png (1024x500 - Play Store banner)');
  console.log('- screenshot-1.png through screenshot-3.png (Phone screenshots)');
}

main().catch(console.error);
