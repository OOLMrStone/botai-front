import type { ReactNode } from 'react';

import { layout } from '@/config/layout';
import { cn } from '@/lib/utils';

interface ScreenHeadingProps {
  title: ReactNode;
  subtitle?: string;
  variant?: keyof typeof layout.heading.variants;
}

// Вкладкам нужна компактная иерархия, даже когда экран достаточно высокий для hero.
export function ScreenHeading({ title, subtitle, variant = 'screen' }: ScreenHeadingProps) {
  const typography = layout.heading.variants[variant];

  return (
    <div className={layout.heading.root}>
      <h1 className={cn(layout.heading.title, typography.title)}>{title}</h1>
      {subtitle ? (
        <p className={cn(layout.heading.subtitle, typography.subtitle)}>{subtitle}</p>
      ) : null}
    </div>
  );
}
