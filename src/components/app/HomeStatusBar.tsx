import { Flame, Zap } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';

interface HomeStatusBarProps {
  streakDays: number;
  xp: number;
}

// Верхняя строка хаба: стрик (пламя) слева и XP справа. Значения - из useUserStats.
// aria-label на стрике, потому что одна цифра рядом с иконкой без него непонятна.
export function HomeStatusBar({ streakDays, xp }: HomeStatusBarProps) {
  return (
    <div className={layout.app.home.status}>
      <span
        className={layout.app.home.statusItem}
        aria-label={`${streakDays} ${COPY.home.streakUnit}`}
      >
        <Flame className={layout.app.home.statusIcon} />
        {streakDays}
      </span>

      <span className={layout.app.home.statusItem}>
        <Zap className={layout.app.home.statusIcon} />
        {`${xp} ${COPY.home.xpUnit}`}
      </span>
    </div>
  );
}

export function HomeStatusBarSkeleton() {
  return (
    <div className={layout.app.home.status}>
      <Skeleton className={layout.app.skeleton.status} />
      <Skeleton className={layout.app.skeleton.status} />
    </div>
  );
}
