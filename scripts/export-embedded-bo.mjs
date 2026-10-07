import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const settings = await readJson('src/config/embedded-bo-export.json');
const originalExport = await readJson('src/config/lemur-export.json');

// Удаляется только единственная подложка, которую добавляет исходный renderer.
// Белые блики, кремовые детали, тени и все остальные узлы остаются исходными.
export function transparentSvg(svg, kind, art, base) {
  if (kind === 'none') return svg;
  const [x, y, width, height] = art.viewBox;
  const white = (base ?? art).colors.white;
  const background =
    kind === 'rect'
      ? `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${white}"/>`
      : `<path fill="${white}" d="M0 0H${width}V${height}H0Z"/>`;
  if (svg.split(background).length !== 2) throw new Error('Expected one native SVG background');
  return svg.replace(background, '');
}

export function packRgba(rgba, width, height, bleed = settings.edgeBleedPixels) {
  const count = width * height;
  const colorBytes = count * settings.packedChannels;
  const packed = Buffer.allocUnsafe(colorBytes * settings.alphaPanels);
  const distance = new Uint8Array(count);
  const queue = new Int32Array(count);
  let head = 0;
  let tail = 0;

  for (let pixel = 0; pixel < count; pixel++) {
    const source = pixel * settings.sourceChannels;
    const target = pixel * settings.packedChannels;
    const alpha = rgba[source + 3];
    packed[target] = rgba[source];
    packed[target + 1] = rgba[source + 1];
    packed[target + 2] = rgba[source + 2];
    packed[colorBytes + target] = alpha;
    packed[colorBytes + target + 1] = alpha;
    packed[colorBytes + target + 2] = alpha;
    if (alpha) distance[pixel] = 1;
  }

  const visit = (source, target) => {
    if (distance[target]) return;
    distance[target] = distance[source] + 1;
    const from = source * settings.packedChannels;
    const to = target * settings.packedChannels;
    packed[to] = packed[from];
    packed[to + 1] = packed[from + 1];
    packed[to + 2] = packed[from + 2];
    queue[tail++] = target;
  };
  const visitNeighbors = (pixel) => {
    const x = pixel % width;
    if (x > 0) visit(pixel, pixel - 1);
    if (x + 1 < width) visit(pixel, pixel + 1);
    if (pixel >= width) visit(pixel, pixel - width);
    if (pixel + width < count) visit(pixel, pixel + width);
  };

  // RGB продолжается за прозрачный край для фильтрации видео; alpha не меняется.
  if (bleed > 0) {
    for (let pixel = 0; pixel < count; pixel++) {
      if (distance[pixel] !== 1) continue;
      visitNeighbors(pixel);
    }
    while (head < tail) {
      const pixel = queue[head++];
      if (distance[pixel] > bleed) continue;
      visitNeighbors(pixel);
    }
  }
  return packed;
}

async function loadAnimation(animation) {
  const motionPath = animation.motion ?? originalExport.animations[animation.name].motion;
  const motion = await readJson(motionPath);
  const art = await readJson(motion.paths.art);
  const base = motion.paths.baseArt ? await readJson(motion.paths.baseArt) : undefined;
  const rendererPath = `src/lib/lemur-${animation.name}-svg.mjs`;
  const renderer = (await import(pathToFileURL(resolve(root, rendererPath))))[animation.renderer];
  if (art.size !== settings.size || motion.fps !== settings.fps) {
    throw new Error(`Unexpected native size or frame rate: ${animation.name}`);
  }

  return { animation, motionPath, motion, art, base, renderer, rendererPath };
}

function jobsFor(source) {
  const { animation, motion } = source;
  const idle = { ...motion, mode: 'idle' };
  const jobs = [
    {
      video: animation.video,
      motion: animation.name === 'hang' ? idle : motion,
      duration: motion.duration + (animation.name === 'hang' ? motion.loopOverlap : 0),
    },
  ];
  if (animation.name !== 'hang') return jobs;

  const count = Math.round(motion.duration / motion.reactionPhaseStep);
  for (let index = 0; index < count; index++) {
    const video = motion.reactionPhaseVideo
      .replace('{index}', String(index).padStart(motion.reactionPhaseDigits, '0'))
      .replace('.mp4', '-alpha.mp4');
    jobs.push({
      video,
      motion: { ...motion, mode: 'heart', bodyOffset: index * motion.reactionPhaseStep },
      duration: motion.reactionEnd,
    });
  }
  return jobs;
}

async function sourceHashes(source) {
  const paths = new Set([source.motionPath, source.motion.paths.art]);
  if (source.motion.paths.baseArt) paths.add(source.motion.paths.baseArt);
  const collect = async (path) => {
    if (paths.has(path)) return;
    paths.add(path);
    const text = await readFile(resolve(root, path), 'utf8');
    for (const match of text.matchAll(/from ['"](.+?)['"]/g)) {
      if (!match[1].startsWith('.')) continue;
      const imported = resolve(dirname(resolve(root, path)), match[1]).slice(root.length + 1);
      await collect(imported);
    }
  };
  await collect(source.rendererPath);
  return Object.fromEntries(
    await Promise.all(
      [...paths].sort().map(async (path) => [
        path,
        createHash('sha256')
          .update(await readFile(resolve(root, path)))
          .digest('hex'),
      ]),
    ),
  );
}

async function renderJob(source, job, first, postersOnly) {
  const { animation, art, base, renderer } = source;
  const directory = resolve(root, source.motion.paths.output);
  const output = resolve(directory, job.video);
  const temporary = output.replace('.mp4', '.partial.mp4');
  const count = Math.round((job.duration ?? job.motion.duration) * job.motion.fps);
  await mkdir(directory, { recursive: true });
  const encoder = postersOnly
    ? null
    : spawn(
        'ffmpeg',
        [
          ...originalExport.ffmpegArguments,
          '-f',
          'rawvideo',
          '-pix_fmt',
          'rgb24',
          '-s',
          `${settings.size}x${settings.size * settings.alphaPanels}`,
          '-r',
          String(job.motion.fps),
          '-i',
          '-',
          '-an',
          ...settings.encoder,
          temporary,
        ],
        { stdio: ['pipe', 'ignore', 'pipe'] },
      );
  let encoderError = '';
  encoder?.stderr.on('data', (chunk) => {
    encoderError += chunk.toString();
  });
  const completed = encoder ? once(encoder, 'close') : null;
  encoder?.stdin.on('error', (cause) => {
    encoderError += cause.message;
  });

  try {
    for (let index = 0; index < (postersOnly ? 1 : count); index++) {
      const svg = transparentSvg(
        renderer(index / job.motion.fps, art, job.motion, base),
        animation.background,
        art,
        base,
      );
      const { data, info } = await sharp(Buffer.from(svg))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      if (info.width !== settings.size || info.height !== settings.size || info.channels !== 4) {
        throw new Error(`Unexpected rendered frame: ${animation.name}`);
      }
      if (first && index === 0) {
        await sharp(data, { raw: info }).png().toFile(resolve(directory, settings.poster));
      }
      if (encoder) {
        if (encoder.exitCode !== null) throw new Error(encoderError || 'Encoder stopped');
        if (!encoder.stdin.write(packRgba(data, info.width, info.height))) {
          await Promise.race([
            once(encoder.stdin, 'drain'),
            completed.then(() => {
              throw new Error(encoderError || 'Encoder stopped before receiving all frames');
            }),
          ]);
        }
      }
      if (!postersOnly && index % settings.progressFrames === 0) {
        console.log(`${animation.name}/${job.video}: ${index + 1}/${count}`);
      }
    }
    if (encoder) {
      encoder.stdin.end();
      const [code] = await completed;
      if (code !== 0) throw new Error(encoderError || `Encoder exited ${code}`);
      await rename(temporary, output);
    }
  } catch (cause) {
    encoder?.kill();
    throw cause;
  }

  return { video: job.video, frames: count, fps: job.motion.fps, duration: count / job.motion.fps };
}

async function main() {
  const selection = process.argv
    .find((value) => value.startsWith('--only='))
    ?.slice('--only='.length);
  const postersOnly = process.argv.includes('--posters-only');
  const videoSelection = process.argv
    .find((value) => value.startsWith('--video='))
    ?.slice('--video='.length);
  if (videoSelection && !selection) throw new Error('--video requires --only');
  const selected = settings.animations.filter((item) => !selection || item.name === selection);
  if (!selected.length) throw new Error(`Unknown animation: ${selection}`);
  const path = resolve(root, settings.manifest);
  const previous = selection
    ? JSON.parse(await readFile(path, 'utf8').catch(() => '{"animations":[]}'))
    : { animations: [] };
  const manifest = [...previous.animations];
  for (const animation of selected) {
    const source = await loadAnimation(animation);
    const jobs = jobsFor(source).filter((job) => !videoSelection || job.video === videoSelection);
    if (!jobs.length) throw new Error(`Unknown video: ${videoSelection}`);
    const videos = [];
    for (const job of jobs) {
      const first = job.video === animation.video;
      if (postersOnly && !first) continue;
      videos.push(await renderJob(source, job, first, postersOnly));
    }
    const previousIndex = manifest.findIndex((entry) => entry.animation === animation.name);
    const previousVideos = videoSelection ? (manifest[previousIndex]?.videos ?? []) : [];
    const updated = {
      animation: animation.name,
      sources: await sourceHashes(source),
      postersOnly,
      videos: [
        ...previousVideos.filter((entry) => !videos.some((video) => video.video === entry.video)),
        ...videos,
      ],
    };
    if (previousIndex < 0) manifest.push(updated);
    else manifest[previousIndex] = updated;
    console.log(`Completed ${animation.name}`);
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify({ settings, animations: manifest }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
