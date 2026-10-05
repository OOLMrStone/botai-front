import { readFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { paywallGesture, paywallFace, bendPaywallPaw } from '../src/lib/lemur-paywall-motion.mjs';
import { preparePaywallEyes, renderPaywallEyes } from '../src/lib/lemur-paywall-eyes.mjs';
import {
  preparePaywallBody,
  paywallBodyPose,
  renderPaywallBody,
} from '../src/lib/lemur-paywall-body.mjs';
import { exportLemurAnimation, lemurFrameName } from './lib/export-lemur-animation.mjs';

const config = JSON.parse(
  await readFile(new URL('../src/config/lemur-paywall-motion.json', import.meta.url), 'utf8'),
);
const { data, info } = await sharp(config.source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const clean = await sharp(config.eyeCleanPlate).ensureAlpha().raw().toBuffer();
const eyes = preparePaywallEyes(clean, info, config);
const body = preparePaywallBody(info, config);

function samplePixel(buffer, offset, x, y) {
  const left = Math.floor(x);
  const top = Math.floor(y);
  const fx = x - left;
  const fy = y - top;
  let alpha = 0;
  const color = [0, 0, 0];

  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 2; column++) {
      const index = ((top + row) * info.width + left + column) * info.channels;
      const weight = (column ? fx : 1 - fx) * (row ? fy : 1 - fy);
      const coverage = data[index + 3] * weight;
      alpha += coverage;
      for (let channel = 0; channel < 3; channel++)
        color[channel] += data[index + channel] * coverage;
    }
  }

  for (let channel = 0; channel < 3; channel++)
    buffer[offset + channel] = alpha ? Math.round(color[channel] / alpha) : 0;
  buffer[offset + 3] = Math.round(alpha);
}

function renderFrame(time) {
  const angle = paywallGesture(time, config);
  const buffer = Buffer.from(data);
  const [left, top, right, bottom] = config.region;

  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      let sourceX = x;
      let sourceY = y;
      for (let step = 0; step < config.inverseIterations; step++) {
        const [targetX, targetY] = bendPaywallPaw(sourceX, sourceY, angle, config);
        sourceX += x - targetX;
        sourceY += y - targetY;
      }
      samplePixel(buffer, (y * info.width + x) * info.channels, sourceX, sourceY);
    }
  }

  renderPaywallEyes(buffer, data, clean, eyes, paywallFace(time, config), config);

  const moving = renderPaywallBody(buffer, info, body, paywallBodyPose(time, config));

  return sharp(moving, { raw: info });
}

await mkdir(config.work, { recursive: true });
await mkdir(config.output, { recursive: true });
const count = config.fps * config.duration;
const keysOnly = process.argv.includes('--keys');
const frameIndices = keysOnly
  ? config.qaFrames
  : Array.from({ length: count }, (_, index) => index);
for (const index of frameIndices) {
  await renderFrame(index / config.fps)
    .png()
    .toFile(`${config.work}/${lemurFrameName(index)}.png`);
}

const sheet = config.contactSheet;
const tiles = await Promise.all(
  config.qaFrames.map(async (index, order) => ({
    input: await sharp(`${config.work}/${lemurFrameName(index)}.png`)
      .resize(sheet.width, sheet.height)
      .png()
      .toBuffer(),
    left: (order % sheet.columns) * sheet.width,
    top: Math.floor(order / sheet.columns) * sheet.height,
  })),
);
await sharp({
  create: {
    width: sheet.width * sheet.columns,
    height: sheet.height * Math.ceil(tiles.length / sheet.columns),
    channels: info.channels,
    background: 'white',
  },
})
  .composite(tiles)
  .png()
  .toFile(sheet.path);
if (!keysOnly)
  await exportLemurAnimation({
    name: 'paywall',
    work: config.work,
    output: config.output,
    fps: config.fps,
    count,
  });
console.log(JSON.stringify({ frames: count, duration: config.duration, output: config.output }));
