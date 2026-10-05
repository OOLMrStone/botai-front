import { lemurSitSvg } from '../src/lib/lemur-sit-svg.mjs';
import { sitPose } from '../src/lib/lemur-sit-motion.mjs';
import { renderLemurAnimation } from './lib/render-lemur-animation.mjs';

await renderLemurAnimation({ name: 'sit', svg: lemurSitSvg, pose: sitPose });
