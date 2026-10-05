import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { lemurHangSvg, hangPose } from '../src/lib/lemur-hang-svg.mjs';
import { renderLemurAnimation } from './lib/render-lemur-animation.mjs';
import { lemurFrameName } from './lib/export-lemur-animation.mjs';

const root = resolve(import.meta.dirname, '..');
const read = async (path) => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const motion = await read('src/config/lemur-hang-motion.json');
const art = await read(motion.paths.art);
const base = await read(motion.paths.baseArt);
const settings = await read('src/config/lemur-export.json');

for (const variant of motion.variants) {
  const variantMotion = {
    ...motion,
    mode: variant.mode,
    paths: { ...motion.paths, work: variant.work, manifest: variant.manifest },
  };

  if (!process.argv.includes('--preview')) {
    await renderLemurAnimation({
      name: variant.export,
      svg: lemurHangSvg,
      pose: hangPose,
      motion: variantMotion,
    });
  }
  if (process.argv.includes('--keys')) continue;

  await renderPreview(variant);
}

if (!process.argv.includes('--keys')) {
  const phaseCount = Math.round(motion.duration / motion.reactionPhaseStep);
  for (let index = 0; index < phaseCount; index++) {
    const name = motion.reactionPhaseVideo.replace(
      '{index}',
      String(index).padStart(motion.reactionPhaseDigits, '0'),
    );
    await renderPreview({
      mode: 'heart',
      bodyOffset: index * motion.reactionPhaseStep,
      previewDuration: motion.reactionEnd,
      previewWork: `${motion.reactionPhaseWork}/${index}`,
      previewVideo: name,
    });
    console.log(`Reaction ${index + 1}/${phaseCount}`);
  }
  const idle = motion.variants.find((variant) => variant.mode === 'idle');
  await sharp(resolve(root, idle.previewWork, `${lemurFrameName(0)}.png`)).toFile(
    resolve(root, motion.paths.output, settings.poster),
  );
}

async function renderPreview(variant) {
  const previewWork = resolve(root, variant.previewWork);
  const duration = variant.previewDuration ?? motion.duration;
  await mkdir(previewWork, { recursive: true });
  for (let index = 0; index < motion.fps * duration; index++) {
    const svg = lemurHangSvg(
      index / motion.fps,
      art,
      { ...motion, mode: variant.mode, bodyOffset: variant.bodyOffset ?? 0 },
      base,
    );
    await sharp(Buffer.from(svg))
      .flatten({ background: base.colors.white })
      .png()
      .toFile(resolve(previewWork, `${lemurFrameName(index)}.png`));
  }
  execFileSync('ffmpeg', [
    ...settings.ffmpegArguments,
    '-framerate',
    String(motion.fps),
    '-i',
    resolve(previewWork, `%0${settings.frameDigits}d.png`),
    '-frames:v',
    String(motion.fps * duration),
    ...settings.mp4Arguments,
    resolve(root, motion.paths.output, variant.previewVideo),
  ]);
}

await writeFile(
  resolve(root, motion.paths.output, motion.posterSvg),
  lemurHangSvg(0, art, motion, base),
);
