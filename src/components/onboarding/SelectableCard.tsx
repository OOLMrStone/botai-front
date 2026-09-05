'use client';

import { Radio } from '@base-ui/react/radio';
import type { ComponentType } from 'react';

import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

interface SelectableCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}

// Крупная карточка-вариант на семантике radio (a11y). Рендерится внутри RadioGroup.
export function SelectableCard({
  value,
  label,
  description,
  icon: Icon,
  className,
}: SelectableCardProps) {
  return (
    <Radio.Root
      value={value}
      className={cn(
        'group bg-muted/45 flex min-h-16 w-full items-center gap-3 rounded-3xl border border-transparent px-4 py-3 text-left outline-none',
        'transition-[background-color,border-color,transform] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100',
        'hover:bg-muted/65 focus-visible:ring-ring/50 focus-visible:ring-3',
        'data-checked:border-ring/35 data-checked:bg-muted',
        className,
      )}
    >
      {/* Без серого квадрата - просто иконка, растёт вместе с высотой карточки. */}
      {Icon ? (
        <span className="text-muted-foreground group-data-[checked]:text-primary flex aspect-square h-full shrink-0 items-center justify-center transition-colors">
          <Icon className="size-[70%]" />
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span className={cn('block', layout.typography.controlTitle)}>{label}</span>
        {description ? (
          <span className={cn('mt-0.5 block', layout.typography.description)}>{description}</span>
        ) : null}
      </span>

      <span className="border-input group-data-[checked]:border-primary mr-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2">
        <Radio.Indicator className="bg-primary size-2.5 rounded-full" />
      </span>
    </Radio.Root>
  );
}
