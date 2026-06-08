const sharp = require('sharp');

async function processImage() {
  try {
    const original = 'C:\\Users\\91985\\.gemini\\antigravity\\brain\\704bc962-ebbe-481a-942f-0ae850f610cf\\media__1780941465316.png';
    
    // We simply overlay pure white rectangles over the top 25px and bottom 25px.
    // This wipes out the black screenshot letterboxing without modifying the image size
    // and completely prevents clipping any letters that are close to the edges.
    await sharp(original)
      .composite([
        {
          input: { create: { width: 678, height: 25, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } },
          top: 0, left: 0
        },
        {
          input: { create: { width: 678, height: 25, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } },
          top: 672 - 25, left: 0
        }
      ])
      .png()
      .toFile('assets/nursego_logo.png');

    console.log('Successfully painted out the letterboxing!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
