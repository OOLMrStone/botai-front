import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

import { lemurFrameSvg } from '../src/lib/lemur-frame-svg.mjs';
import { footPose, bodyPose, tailPoint } from '../src/lib/lemur-continuous-motion.mjs';
import { exportLemurAnimation, lemurFrameName } from './lib/export-lemur-animation.mjs';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(await readFile(resolve(root, 'src/config/lemur-motion.json'), 'utf8'));
const face = JSON.parse(await readFile(resolve(root, config.paths.face), 'utf8'));
const work = resolve(root, config.paths.work);
const output = resolve(root, config.paths.output);
const count = config.fps * config.duration;
await mkdir(work, { recursive: true });
await mkdir(output, { recursive: true });

const manifest = [];
for (let index = 0; index < count; index++) {
  const phase = index / count;
  const svg = lemurFrameSvg(phase, config, face);
  const name = lemurFrameName(index);
  await writeFile(resolve(work, `${name}.svg`), svg);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(resolve(work, `${name}.png`));
  manifest.push({
    index,
    phase,
    body: bodyPose(phase, config),
    tailTip: tailPoint(1, phase, config),
    feet: config.legs.map((leg) => ({ name: leg.name, ...footPose(phase, leg, config) })),
  });
}

await exportLemurAnimation({
  name: 'walk',
  work,
  output,
  fps: config.fps,
  count,
  size: config.size,
});
await writeFile(
  resolve(root, config.paths.manifest),
  JSON.stringify(
    { fps: config.fps, duration: config.duration, uniqueFrames: count, frames: manifest },
    null,
    2,
  ),
);
console.log(JSON.stringify({ output, frames: count, fps: config.fps, size: config.size }));
