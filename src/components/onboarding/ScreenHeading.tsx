import type { ReactNode } from 'react';

import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

interface ScreenHeadingProps {
  title: ReactNode;
  subtitle?: string;
}

// Единая типографика заголовка экрана (скилл typography): h1 + опциональный подзаголовок.
// Размер флюидный (из layout) - масштабируется под высоту экрана. Оба поддерживают
// ручной перенос через \n (whitespace-pre-line).
export function ScreenHeading({ title, subtitle }: ScreenHeadingProps) {
  return (
    <div className={layout.heading.gap}>
      <h1
        className={cn(
          'font-extrabold tracking-tight text-balance whitespace-pre-line',
          layout.heading.title,
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            'text-muted-foreground text-balance whitespace-pre-line',
            layout.heading.subtitle,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
