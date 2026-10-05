import { lemurWaveSvg } from '../src/lib/lemur-wave-svg.mjs';
import { wavePose } from '../src/lib/lemur-wave-motion.mjs';
import { renderLemurAnimation } from './lib/render-lemur-animation.mjs';

await renderLemurAnimation({ name: 'wave', svg: lemurWaveSvg, pose: wavePose });
