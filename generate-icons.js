// Script to generate PWA icons from SVG
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const iconsDir = path.join(__dirname, 'public', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

console.log('📱 SmartInvoice AI - PWA Icon Generator\n');

const svgBuffer = fs.readFileSync(svgPath);

console.log('Generating icons...\n');

Promise.all(
  sizes.map(async (size) => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated icon-${size}x${size}.png`);
  })
).then(() => {
  console.log('\n✅ All icons generated successfully!');
  console.log('Your PWA is ready to be installed on devices.');
}).catch(err => {
  console.error('❌ Error generating icons:', err);
});

