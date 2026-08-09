const sharp = require('sharp');

async function processImage() {
  try {
    const inputPath = 'assets/nursego_logo.png'; // Using the proper high-res logo!
    const outputPath = 'assets/logo_padded.png';
    
    // Resize the high-res logo to fit safely inside the Android icon circle
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

    console.log('Successfully created a proper padded adaptive icon from the high-res logo!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
