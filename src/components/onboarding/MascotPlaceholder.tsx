import { layout } from '@/config/layout';
import { Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

interface MascotPlaceholderProps {
  className?: string;
  size?: 'md' | 'lg';
}

// Заглушка под будущего маскота. Финальный арт — отдельно, позже.
export function MascotPlaceholder({ className, size = 'lg' }: MascotPlaceholderProps) {
  const box = size === 'lg' ? 'size-32' : 'size-20';

  return (
    <div className={cn(layout.surface.mascot, box, className)} aria-hidden="true">
      <Sparkles className="size-1/3" />
    </div>
  );
}
