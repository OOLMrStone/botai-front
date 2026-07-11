'use client';

import { Radio } from '@base-ui/react/radio';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SelectableCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
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
        'group border-border bg-card flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all outline-none active:scale-[0.99]',
        'hover:border-ring/60 focus-visible:ring-ring/50 focus-visible:ring-3',
        'data-checked:border-primary data-checked:bg-accent',
        className,
      )}
    >
      {Icon ? (
        <span className="bg-muted text-muted-foreground group-data-[checked]:bg-primary/10 group-data-[checked]:text-primary flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors">
          <Icon className="size-5" />
        </span>
      ) : null}

      <span className="flex-1">
        <span className="block font-medium">{label}</span>
        {description ? (
          <span className="text-muted-foreground mt-0.5 block text-sm">{description}</span>
        ) : null}
      </span>

      <span className="border-input group-data-[checked]:border-primary flex size-5 shrink-0 items-center justify-center rounded-full border-2">
        <Radio.Indicator className="bg-primary size-2.5 rounded-full" />
      </span>
    </Radio.Root>
  );
}
