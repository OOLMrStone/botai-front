import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const sourceRoot = new URL('../../botai-front/', import.meta.url);
const require = createRequire(new URL('package.json', sourceRoot));
const sharp = require('sharp');
const destination = new URL('../artifacts/paywall-study/', import.meta.url);
const palette = JSON.parse(
  await readFile(new URL('src/config/lemur-paywall-palette.json', sourceRoot)),
)
  .slice(1)
  .map(({ fill }) => fill);
const width = 1536;
const height = 1024;
const length = width * height;
const neighbors = [-width, 1, width, -1];

function foregroundColor(data, pixel) {
  const rgb = [data[pixel * 3], data[pixel * 3 + 1], data[pixel * 3 + 2]];
  let best = rgb;
  let distance = Infinity;
  for (const color of palette) {
    const error = color.reduce((sum, value, channel) => sum + (value - rgb[channel]) ** 2, 0);
    if (error < distance) {
      distance = error;
      best = color;
    }
  }
  return best;
}

function alphaFrame(data) {
  const outside = new Uint8Array(length);
  const queue = new Int32Array(length);
  let head = 0;
  let tail = 0;
  function visit(index) {
    if (index < 0 || index >= length || outside[index]) return;
    const red = data[index * 3];
    const green = data[index * 3 + 1];
    const blue = data[index * 3 + 2];
    if (
      Math.min(red, green, blue) <= 165 ||
      Math.max(red, green, blue) - Math.min(red, green, blue) >= 8
    )
      return;
    outside[index] = 1;
    queue[tail++] = index;
  }
  for (let x = 0; x < width; x++) {
    visit(x);
    visit(length - width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    visit(y * width);
    visit(y * width + width - 1);
  }
  while (head < tail) {
    const pixel = queue[head++];
    for (const offset of neighbors) visit(pixel + offset);
  }

  const depth = new Uint8Array(length);
  head = 0;
  tail = 0;
  for (let pixel = width; pixel < length - width; pixel++) {
    if (!outside[pixel] && neighbors.some((offset) => outside[pixel + offset])) {
      depth[pixel] = 1;
      queue[tail++] = pixel;
    }
  }
  while (head < tail) {
    const pixel = queue[head++];
    if (depth[pixel] >= 4) continue;
    for (const offset of neighbors) {
      const next = pixel + offset;
      if (next < 0 || next >= length || outside[next] || depth[next]) continue;
      depth[next] = depth[pixel] + 1;
      queue[tail++] = next;
    }
  }

  const nearest = new Int32Array(length).fill(-1);
  const travel = new Uint8Array(length);
  head = 0;
  tail = 0;
  for (let pixel = 0; pixel < length; pixel++) {
    if (depth[pixel] === 4) {
      nearest[pixel] = pixel;
      queue[tail++] = pixel;
    }
  }
  while (head < tail) {
    const pixel = queue[head++];
    if (travel[pixel] >= 7) continue;
    for (const offset of neighbors) {
      const next = pixel + offset;
      if (
        next < 0 ||
        next >= length ||
        nearest[next] !== -1 ||
        (!outside[next] && depth[next] === 0)
      )
        continue;
      nearest[next] = nearest[pixel];
      travel[next] = travel[pixel] + 1;
      queue[tail++] = next;
    }
  }

  const rgba = Buffer.alloc(length * 4);
  const packed = Buffer.alloc(length * 6, 255);
  for (let pixel = 0; pixel < length; pixel++) {
    let alpha = outside[pixel] ? 0 : 1;
    let rgb = [data[pixel * 3], data[pixel * 3 + 1], data[pixel * 3 + 2]];
    const core = nearest[pixel];
    if (core !== -1 && (outside[pixel] || depth[pixel] < 4)) {
      const color = foregroundColor(data, core);
      if (outside[pixel]) rgb = color;
      else {
        const denominator = color.reduce((sum, value) => sum + (255 - value) ** 2, 0);
        alpha = Math.max(
          0,
          Math.min(
            1,
            color.reduce((sum, value, channel) => sum + (255 - rgb[channel]) * (255 - value), 0) /
              denominator,
          ),
        );
        if (alpha > 0.001)
          rgb = rgb.map((value) => Math.max(0, Math.min(255, (value - 255 * (1 - alpha)) / alpha)));
      }
    }
    const byteAlpha = Math.round(alpha * 255);
    for (let channel = 0; channel < 3; channel++) {
      rgba[pixel * 4 + channel] = Math.round(rgb[channel]);
      packed[pixel * 3 + channel] = Math.round(rgb[channel]);
      packed[length * 3 + pixel * 3 + channel] = byteAlpha;
    }
    rgba[pixel * 4 + 3] = byteAlpha;
  }
  return { rgba, packed };
}

const posterOnly = process.argv.includes('--poster-only');
const encoder = posterOnly
  ? null
  : spawn(
      'ffmpeg',
      [
        '-y',
        '-f',
        'rawvideo',
        '-pix_fmt',
        'rgb24',
        '-s',
        `${width}x${height * 2}`,
        '-r',
        '60',
        '-i',
        '-',
        '-an',
        '-c:v',
        'libx264',
        '-preset',
        'fast',
        '-crf',
        '10',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        fileURLToPath(new URL('lemur-alpha.mp4', destination)),
      ],
      { stdio: ['pipe', 'ignore', 'inherit'] },
    );
for (let frame = 0; frame < (posterOnly ? 1 : 480); frame++) {
  const source = new URL(
    `artifacts/lemur-paywall/frames-v5/${String(frame).padStart(3, '0')}.png`,
    sourceRoot,
  );
  const data = await sharp(fileURLToPath(source)).removeAlpha().raw().toBuffer();
  const { rgba, packed } = alphaFrame(data);
  if (frame === 0)
    await sharp(rgba, { raw: { width, height, channels: 4 } })
      .png()
      .toFile(fileURLToPath(new URL('lemur-alpha-poster.png', destination)));
  if (encoder && !encoder.stdin.write(packed)) await once(encoder.stdin, 'drain');
  if (frame % 30 === 0) console.log(`Alpha frames: ${frame + 1}/480`);
}
if (encoder) {
  encoder.stdin.end();
  const [code] = await once(encoder, 'close');
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
}
