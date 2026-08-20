import Image from 'next/image';
import katex from 'katex';

import { layout } from '@/config/layout';
import { TASK_DEFAULT_IMAGE_ASPECT_RATIO, TASK_IMAGE_SIZES, type TaskBlock } from '@/config/tasks';
import { cn } from '@/lib/utils';

function LatexBlock({ value }: { value: string }) {
  const html = katex.renderToString(value, { throwOnError: false, output: 'html' });
  return <div className={layout.training.latex} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function TaskBlockRenderer({ blocks }: { blocks: TaskBlock[] }) {
  return (
    <div className={layout.training.blockList}>
      {blocks.map((block, index) => {
        if (block.type === 'text')
          return (
            <p key={index} className={layout.training.blockText}>
              {block.value}
            </p>
          );
        if (block.type === 'latex') return <LatexBlock key={index} value={block.value} />;
        return (
          <div
            key={index}
            className={layout.training.image}
            style={{ aspectRatio: block.aspectRatio ?? TASK_DEFAULT_IMAGE_ASPECT_RATIO }}
          >
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className={cn(
                layout.training.blockImage,
                block.colorMode === 'monochrome' && layout.training.blockImageMonochrome,
              )}
              sizes={TASK_IMAGE_SIZES}
              loading="eager"
            />
          </div>
        );
      })}
    </div>
  );
}
