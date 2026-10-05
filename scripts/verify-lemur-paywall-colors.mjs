import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
const config = JSON.parse(await readFile('src/config/lemur-paywall-cleanup.json', 'utf8'));
const motion = JSON.parse(await readFile('src/config/lemur-paywall-motion.json', 'utf8'));
const root = config.root;
const { data, info } = await sharp(root + config.result)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const plate = await sharp(root + config.resultPlate)
  .removeAlpha()
  .raw()
  .toBuffer();
const boxes = config.samples;
const report = { samples: {}, plateDifferencePixels: 0, plateDifferencesOutsideEyes: 0 };
for (const [name, [x, y, X, Y]] of Object.entries(boxes)) {
  const unique = new Set();
  for (let j = y; j < Y; j++)
    for (let i = x; i < X; i++)
      unique.add(
        [...data.subarray((j * info.width + i) * 3, (j * info.width + i) * 3 + 3)].join(','),
      );
  report.samples[name] = { unique: unique.size, colors: [...unique] };
}
for (let i = 0; i < info.width * info.height; i++) {
  if (data.subarray(i * 3, i * 3 + 3).equals(plate.subarray(i * 3, i * 3 + 3))) continue;
  report.plateDifferencePixels++;
  const x = i % info.width,
    y = Math.floor(i / info.width);
  if (
    !motion.face.eyes
      .map((eye) => eye.region)
      .some(([l, t, r, b]) => x >= l && x < r && y >= t && y < b)
  )
    report.plateDifferencesOutsideEyes++;
}
await writeFile(
  root + config.auditDirectory + 'verification.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(JSON.stringify(report, null, 2));
if (Object.values(report.samples).some((sample) => sample.unique !== 1)) {
  throw new Error('Внутри заливки обнаружено несколько цветов');
}
if (report.plateDifferencesOutsideEyes !== 0) {
  throw new Error('Подложка глаз отличается от рисунка за пределами глаз');
}
