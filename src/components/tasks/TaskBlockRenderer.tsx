import Image from 'next/image';
import { MathFormula } from '@/components/common/MathFormula';

import { layout } from '@/config/layout';
import { TASK_DEFAULT_IMAGE_ASPECT_RATIO, TASK_IMAGE_SIZES, type TaskBlock } from '@/config/tasks';
import { cn } from '@/lib/utils';

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
        if (block.type === 'latex')
          return <MathFormula key={index} value={block.value} className={layout.training.latex} />;
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
