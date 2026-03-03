const sharp = require('sharp');
const fs = require('fs');

const inPath = 'C:\\Users\\Inazawa Electronics\\.gemini\\antigravity\\brain\\aad6d540-afa2-44e2-bb65-840eaafcad8d\\media__1772475627999.jpg';
const outPath = 'C:\\Users\\Inazawa Electronics\\Desktop\\UD Camping Gears\\public\\icon-camp.png';

async function makeCircle() {
    const metadata = await sharp(inPath).metadata();
    const minDim = Math.min(metadata.width, metadata.height);
    const r = minDim / 2;
    const circleSvg = `<svg width="${minDim}" height="${minDim}"><circle cx="${r}" cy="${r}" r="${r}" /></svg>`;

    await sharp(inPath)
        .resize(minDim, minDim, { fit: 'cover' })
        .composite([{
            input: Buffer.from(circleSvg),
            blend: 'dest-in'
        }])
        .png()
        .toFile(outPath);
    console.log("Image circularly cropped successfully.");
}
makeCircle().catch(console.error);
