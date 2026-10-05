import { lemurCrySvg } from '../src/lib/lemur-cry-svg.mjs';
import { cryPose } from '../src/lib/lemur-cry-motion.mjs';
import { renderLemurAnimation } from './lib/render-lemur-animation.mjs';

await renderLemurAnimation({ name: 'cry', svg: lemurCrySvg, pose: cryPose });
