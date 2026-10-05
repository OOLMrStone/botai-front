import { lemurJoySvg } from '../src/lib/lemur-joy-svg.mjs';
import { joyPose } from '../src/lib/lemur-joy-motion.mjs';
import { renderLemurAnimation } from './lib/render-lemur-animation.mjs';

await renderLemurAnimation({ name: 'joy', svg: lemurJoySvg, pose: joyPose });
