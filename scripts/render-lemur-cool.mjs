import { lemurCoolSvg, coolPose } from '../src/lib/lemur-cool-svg.mjs';
import { renderLemurAnimation } from './lib/render-lemur-animation.mjs';

await renderLemurAnimation({ name: 'cool', svg: lemurCoolSvg, pose: coolPose });
