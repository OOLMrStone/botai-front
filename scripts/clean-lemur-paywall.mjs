import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const config = JSON.parse(await readFile('src/config/lemur-paywall-cleanup.json', 'utf8'));
const motion = JSON.parse(await readFile('src/config/lemur-paywall-motion.json', 'utf8'));
const root = config.root;
const colors = JSON.parse(await readFile('src/config/lemur-paywall-palette.json', 'utf8'));
const eyes = motion.face.eyes.map((eye) => eye.region);
const threshold = config.thresholds;
const within = (x, y, b) => x >= b[0] && y >= b[1] && x < b[2] && y < b[3];
const inEyes = (x, y) => eyes.some((b) => within(x, y, b));
const inNose = (x, y) => within(x, y, config.noseRegion);
const inStroke = (x, y) =>
  config.strokeRegions.some((b) => within(x, y, b)) &&
  !config.strokeExclusions.some(
    ([left, top, right, , , bottom]) =>
      x >= left &&
      y >= top &&
      y <= bottom &&
      (x - left) / (right - left) + (y - top) / (bottom - top) <= 1,
  );
function classify(data, w, h, clean = false) {
  const labels = new Uint8Array(w * h);
  for (let i = 0; i < labels.length; i++) {
    const x = i % w,
      y = Math.floor(i / w),
      p = [...data.subarray(i * 3, i * 3 + 3)];
    const allowed = [0, 1, 2, 3, 4];
    if (inEyes(x, y) && !clean) allowed.push(5);
    if (inNose(x, y)) allowed.push(6);
    if (inStroke(x, y)) allowed.push(7);
    let best = Infinity;
    for (const k of allowed) {
      const c = colors[k].source;
      // Кремовую тень объединяем с основным кремовым полем.
      const d = p.reduce((s, v, j) => s + (v - c[j]) ** 2, 0);
      if (d < best) {
        best = d;
        labels[i] = k;
      }
    }
    if (
      p[0] > threshold.creamMin[0] &&
      p[1] > threshold.creamMin[1] &&
      p[2] > threshold.creamMin[2] &&
      p[0] - p[2] > threshold.creamContrast[0] &&
      p[1] - p[2] > threshold.creamContrast[1]
    )
      labels[i] = 1;
    if (
      p[0] > threshold.backgroundMin &&
      Math.max(...p) - Math.min(...p) < threshold.backgroundChroma
    )
      labels[i] = 0;
    if (
      p[0] > threshold.grayRed[0] &&
      p[0] < threshold.grayRed[1] &&
      p[1] < threshold.grayGreen &&
      p[0] - p[1] < threshold.grayContrast
    )
      labels[i] = 3;
    if (
      inStroke(x, y) &&
      p[0] > threshold.grayRed[0] &&
      p[0] < threshold.lineRedMax &&
      p[1] < threshold.lineGreenMax
    )
      labels[i] = 7;
    if (labels[i] === 5 && Math.max(...p) > threshold.pupilMax) labels[i] = 4;
    if (within(x, y, config.shadowRegion) && labels[i] === 4) labels[i] = 3;
  }
  return labels;
}
function flatten(data, w, h, labels) {
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < labels.length; i++) {
    const x = i % w,
      y = Math.floor(i / w),
      k = labels[i],
      p = [...data.subarray(i * 3, i * 3 + 3)];
    const near = new Set();
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (x + dx >= 0 && x + dx < w && y + dy >= 0 && y + dy < h)
          near.add(labels[i + dy * w + dx]);
      }
    // Исходная опорная тень остаётся вне цветного силуэта.
    if (k === 0 && near.size === 1 && !inEyes(x, y)) {
      out.set(p, i * 3);
      continue;
    }
    let fill = colors[k].fill;
    if (near.size > 1) {
      let best = Infinity;
      for (const other of near) {
        if (other === k) continue;
        const a = colors[k].source,
          b = colors[other].source,
          v = b.map((n, j) => n - a[j]);
        let t = p.reduce((s, n, j) => s + (n - a[j]) * v[j], 0) / v.reduce((s, n) => s + n * n, 0);
        t = Math.max(0, Math.min(1, t));
        const error = p.reduce((s, n, j) => s + (n - (a[j] + v[j] * t)) ** 2, 0);
        if (error < best) {
          best = error;
          fill = colors[k].fill.map((n, j) => Math.round(n + (colors[other].fill[j] - n) * t));
        }
      }
    }
    out.set(fill, i * 3);
  }
  return out;
}
const { data, info } = await sharp(root + config.source)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const labels = classify(data, w, h);
const result = flatten(data, w, h, labels);
// Мягкое сглаживание только стыка живота и опорной тени, не заливок.
const smooth = await sharp(result, { raw: { width: w, height: h, channels: 3 } })
  .blur(config.groundBlur)
  .raw()
  .toBuffer();
for (let y = config.groundRegion[1]; y < config.groundRegion[3]; y++)
  for (let x = config.groundRegion[0]; x < config.groundRegion[2]; x++) {
    const i = y * w + x;
    if (labels[i] !== 0 && labels[i] !== 1) continue;
    let background = false,
      cream = false;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const k = labels[i + dy * w + dx];
        background ||= k === 0;
        cream ||= k === 1;
      }
    if (background && cream) result.set(smooth.subarray(i * 3, i * 3 + 3), i * 3);
  }
await sharp(result, { raw: { width: w, height: h, channels: 3 } })
  .png()
  .toFile(root + config.result);
const old = await sharp(root + config.sourcePlate)
  .removeAlpha()
  .raw()
  .toBuffer();
const oldLabels = classify(old, w, h, true);
const oldFlat = flatten(old, w, h, oldLabels);
const plate = Buffer.from(result);
for (let i = 0; i < labels.length; i++) {
  const x = i % w,
    y = Math.floor(i / w);
  if (!inEyes(x, y)) continue;
  let pupilEdge = false;
  for (let dy = -config.eyeRepairRadius; dy <= config.eyeRepairRadius && !pupilEdge; dy++)
    for (let dx = -config.eyeRepairRadius; dx <= config.eyeRepairRadius && !pupilEdge; dx++) {
      const q = i + dy * w + dx;
      pupilEdge = labels[q] === 5 || (labels[q] === 0 && inEyes(x + dx, y + dy));
    }
  if (pupilEdge) plate.set(oldFlat.subarray(i * 3, i * 3 + 3), i * 3);
}
await sharp(plate, { raw: { width: w, height: h, channels: 3 } })
  .png()
  .toFile(root + config.resultPlate);
for (const [name, box] of Object.entries(config.crops))
  await sharp(root + config.result)
    .extract(box)
    .png()
    .toFile(root + config.auditDirectory + name + '.png');
console.log('Saved clean source and matching eye plate');
