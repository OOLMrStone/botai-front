import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const media = new URL('../artifacts/paywall-study/', import.meta.url);
const temporary = await mkdtemp(join(tmpdir(), 'paywall-alpha-webp-'));
const fps = 60;
const count = 480;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command}: ${code}`));
    });
  });
}

try {
  await run('ffmpeg', [
    '-y',
    '-v',
    'error',
    '-i',
    fileURLToPath(new URL('lemur-alpha.mp4', media)),
    '-filter_complex',
    '[0:v]split=2[color][mask];[color]crop=1536:1024:0:0[rgb];[mask]crop=1536:1024:0:1024,format=gray[alpha];[rgb][alpha]alphamerge[out]',
    '-map',
    '[out]',
    '-fps_mode',
    'passthrough',
    join(temporary, '%03d.png'),
  ]);
  console.log('Decoded 480 full-resolution RGBA frames');

  const args = ['-loop', '0', '-sharp_yuv', '-lossy', '-q', '95', '-m', '3', '-exact'];
  for (let frame = 0; frame < count; frame++) {
    // WebP хранит целые миллисекунды: чередование сохраняет суммарные 8 секунд.
    const duration = Math.round(((frame + 1) * 1000) / fps) - Math.round((frame * 1000) / fps);
    args.push('-d', String(duration), join(temporary, `${String(frame + 1).padStart(3, '0')}.png`));
  }
  args.push('-o', join(temporary, 'animation.webp'));
  await run('img2webp', args);
  await run('webpmux', [
    '-set',
    'bgcolor',
    '0,0,0,0',
    join(temporary, 'animation.webp'),
    '-o',
    fileURLToPath(new URL('lemur-transparent.webp', media)),
  ]);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
