const sharp = require('sharp');

async function processImage() {
  try {
    const inputPath = 'assets/logo.jpeg';
    const outputPath = 'assets/logo_padded.png';
    
    // We create a 1080x1080 canvas for the adaptive icon.
    // We resize the original logo to fit within a safe zone (e.g., 600x600).
    const resizedLogo = await sharp(inputPath)
      .resize({ width: 600, height: 600, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();

    await sharp({
      create: {
        width: 1080,
        height: 1080,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedLogo, gravity: 'center' }
    ])
    .png()
    .toFile(outputPath);

    console.log('Successfully created a padded adaptive icon!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
