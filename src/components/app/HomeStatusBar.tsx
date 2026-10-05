import { Clock, Flame } from 'lucide-react';

import { Wordmark } from '@/components/onboarding/Wordmark';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';

interface HomeStatusBarProps {
  streakDays: number;
  studyHours: string;
}

// Стрик и время обучения приходят из одной статистики с профилем.
// aria-label на стрике, потому что одна цифра рядом с иконкой без него непонятна.
export function HomeStatusBar({ streakDays, studyHours }: HomeStatusBarProps) {
  return (
    <div className={layout.app.home.status}>
      <span
        className={layout.app.home.statusItem}
        aria-label={`${streakDays} ${COPY.home.streakUnit}`}
      >
        <Flame className={layout.app.home.statusIcon} />
        {streakDays}
      </span>

      <span className={layout.app.home.brand}>
        <Wordmark variant="compact" />
      </span>
      <span
        className={layout.app.home.statusEnd}
        aria-label={`${COPY.home.studyTimeLabel}: ${studyHours} ${COPY.home.hoursUnit}`}
      >
        <Clock className={layout.app.home.statusIcon} aria-hidden="true" />
        {`${studyHours} ${COPY.home.hoursUnit}`}
      </span>
    </div>
  );
}

export function HomeStatusBarSkeleton() {
  return (
    <div className={layout.app.home.status}>
      <Skeleton className={layout.app.skeleton.status} />
      <span className={layout.app.home.brand}>
        <Wordmark variant="compact" />
      </span>
      <Skeleton className={layout.app.skeleton.status} />
    </div>
  );
}
