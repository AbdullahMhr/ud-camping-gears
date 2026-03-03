const sharp = require('sharp');
const fs = require('fs');

const inPath = 'C:\\Users\\Inazawa Electronics\\.gemini\\antigravity\\brain\\aad6d540-afa2-44e2-bb65-840eaafcad8d\\media__1772476635622.png';
const outPathPublic = 'C:\\Users\\Inazawa Electronics\\Desktop\\UD Camping Gears\\public\\tab-logo.png';
const outPathApp = 'C:\\Users\\Inazawa Electronics\\Desktop\\UD Camping Gears\\src\\app\\icon.png';

async function makeCircle() {
    const metadata = await sharp(inPath).metadata();
    const minDim = Math.min(metadata.width, metadata.height);
    const r = minDim / 2;
    const circleSvg = `<svg width="${minDim}" height="${minDim}"><circle cx="${r}" cy="${r}" r="${r}" /></svg>`;

    const buffer = await sharp(inPath)
        .resize(minDim, minDim, { fit: 'cover' })
        .composite([{
            input: Buffer.from(circleSvg),
            blend: 'dest-in'
        }])
        .png()
        .toBuffer();

    fs.writeFileSync(outPathPublic, buffer);
    fs.writeFileSync(outPathApp, buffer);
    console.log("Tab and PWA local images cropped and saved successfully.");
}
makeCircle().catch(console.error);
