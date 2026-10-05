import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const sourceRoot = new URL('../../botai-front/', import.meta.url);
const require = createRequire(new URL('package.json', sourceRoot));
const sharp = require('sharp');
const destination = new URL('../artifacts/paywall-study/', import.meta.url);
const palette = JSON.parse(
  await readFile(new URL('src/config/lemur-paywall-palette.json', sourceRoot)),
);
const colors = palette.map(({ fill }) => fill);
const fills = colors.map(
  (color) => `#${color.map((value) => value.toString(16).padStart(2, '0')).join('')}`,
);
const cache = new Map();

function nearest(r, g, b) {
  const key = (r << 16) | (g << 8) | b;
  if (cache.has(key)) return cache.get(key);
  let best = 0;
  let distance = Infinity;
  if (!(Math.min(r, g, b) > 175 && Math.max(r, g, b) - Math.min(r, g, b) < 20)) {
    for (let index = 0; index < colors.length; index++) {
      const color = colors[index];
      const current = (r - color[0]) ** 2 + (g - color[1]) ** 2 + (b - color[2]) ** 2;
      if (current < distance) {
        distance = current;
        best = index;
      }
    }
  }
  cache.set(key, best);
  return best;
}

function simplify(points, tolerance = 1.05) {
  if (points.length < 4) return points;
  const first = points[0];
  const last = points.at(-1);
  const dx = last[0] - first[0];
  const dy = last[1] - first[1];
  const length = dx * dx + dy * dy;
  let maximum = tolerance * tolerance;
  let split = 0;
  for (let index = 1; index < points.length - 1; index++) {
    const point = points[index];
    const t = length
      ? Math.max(0, Math.min(1, ((point[0] - first[0]) * dx + (point[1] - first[1]) * dy) / length))
      : 0;
    const distance = (point[0] - first[0] - t * dx) ** 2 + (point[1] - first[1] - t * dy) ** 2;
    if (distance > maximum) {
      maximum = distance;
      split = index;
    }
  }
  return split
    ? [
        ...simplify(points.slice(0, split + 1), tolerance).slice(0, -1),
        ...simplify(points.slice(split), tolerance),
      ]
    : [first, last];
}

function smooth(points) {
  const half = Math.floor(points.length / 2);
  const vertices = [
    ...simplify(points.slice(0, half + 1)).slice(0, -1),
    ...simplify([...points.slice(half), points[0]]).slice(0, -1),
  ];
  if (vertices.length < 3) return '';
  const middle = (a, b) => `${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2}`;
  let path = `M${middle(vertices.at(-1), vertices[0])}`;
  for (let index = 0; index < vertices.length; index++) {
    const point = vertices[index];
    path += `Q${point[0]},${point[1]} ${middle(point, vertices[(index + 1) % vertices.length])}`;
  }
  return `${path}Z`;
}

function contours(labels, width, height, color) {
  const stride = width + 1;
  const edges = new Map();
  function edge(x1, y1, x2, y2) {
    const start = y1 * stride + x1;
    const end = y2 * stride + x2;
    const values = edges.get(start);
    if (values) values.push(end);
    else edges.set(start, [end]);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const position = y * width + x;
      if (labels[position] !== color) continue;
      if (y === 0 || labels[position - width] !== color) edge(x, y, x + 1, y);
      if (x === width - 1 || labels[position + 1] !== color) edge(x + 1, y, x + 1, y + 1);
      if (y === height - 1 || labels[position + width] !== color) edge(x + 1, y + 1, x, y + 1);
      if (x === 0 || labels[position - 1] !== color) edge(x, y + 1, x, y);
    }
  }
  const paths = [];
  while (edges.size) {
    const start = edges.keys().next().value;
    let current = start;
    const points = [];
    do {
      points.push([current % stride, Math.floor(current / stride)]);
      const next = edges.get(current);
      if (!next) break;
      const end = next.pop();
      if (!next.length) edges.delete(current);
      current = end;
    } while (current !== start);
    const area =
      points.reduce((sum, point, index) => {
        const next = points[(index + 1) % points.length];
        return sum + point[0] * next[1] - next[0] * point[1];
      }, 0) / 2;
    // Белые блики сохраняются, внешняя белая область и контактная тень не экспортируются.
    if (Math.abs(area) < 6 || (color === 0 && (area < 0 || area > 1500))) continue;
    paths.push(smooth(points));
  }
  return paths.join('');
}

async function trace(frame) {
  const name = `${String(frame).padStart(3, '0')}.png`;
  const { data, info } = await sharp(
    fileURLToPath(new URL(`artifacts/lemur-paywall/frames-v5/${name}`, sourceRoot)),
  )
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const labels = new Uint8Array(info.width * info.height);
  for (let index = 0; index < labels.length; index++)
    labels[index] = nearest(data[index * 3], data[index * 3 + 1], data[index * 3 + 2]);
  return colors
    .map((_, color) => {
      const d = contours(labels, info.width, info.height, color);
      return d
        ? `<path fill="${fills[color]}" stroke="${fills[color]}" stroke-width="1.2" stroke-linejoin="round" paint-order="stroke fill" fill-rule="evenodd" d="${d}"/>`
        : '';
    })
    .join('');
}

const count = process.argv.includes('--poster-only') ? 1 : 480;
const frames = [];
for (let frame = 0; frame < count; frame++) {
  frames.push(await trace(frame));
  if (frame === 0)
    await writeFile(
      new URL('lemur.svg', destination),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1024">${frames[0]}</svg>`,
    );
  if (frame % 30 === 0) console.log(`Vector frames: ${frame + 1}/${count}`);
}
if (count > 1)
  await writeFile(
    new URL('lemur-vector.json', destination),
    JSON.stringify({ width: 1536, height: 1024, fps: 60, frames }),
  );
