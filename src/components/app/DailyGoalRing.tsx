import { AppCard } from '@/components/app/AppCard';
import { Skeleton } from '@/components/ui/skeleton';
import { dailyGoalRing } from '@/config/app-layout';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';

interface DailyGoalRingProps {
  progressMinutes: number;
  goalMinutes: number;
}

export function DailyGoalRing({ progressMinutes, goalMinutes }: DailyGoalRingProps) {
  const circumference = 2 * Math.PI * dailyGoalRing.radius;
  const fraction = goalMinutes > 0 ? Math.min(Math.max(progressMinutes / goalMinutes, 0), 1) : 0;
  const done = goalMinutes > 0 && progressMinutes >= goalMinutes;

  return (
    <AppCard>
      <p className={layout.typography.description}>
        {done ? COPY.home.dailyGoalDone : COPY.home.dailyGoalTitle}
      </p>
      <div className={layout.app.home.ring}>
        <svg viewBox={dailyGoalRing.viewBox} className={layout.app.home.ringSvg} aria-hidden="true">
          <circle
            cx={dailyGoalRing.center}
            cy={dailyGoalRing.center}
            r={dailyGoalRing.radius}
            fill="none"
            strokeWidth={dailyGoalRing.strokeWidth}
            className={layout.app.home.ringTrack}
          />
          <circle
            cx={dailyGoalRing.center}
            cy={dailyGoalRing.center}
            r={dailyGoalRing.radius}
            fill="none"
            strokeWidth={dailyGoalRing.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
            transform={dailyGoalRing.start}
            className={layout.app.home.ringProgress}
          />
        </svg>
        <div className={layout.app.home.ringLabel}>
          <p className={layout.typography.value}>
            {progressMinutes} / {goalMinutes}
          </p>
          <p className={layout.typography.caption}>{COPY.home.dailyGoalUnit}</p>
        </div>
      </div>
    </AppCard>
  );
}

export function DailyGoalRingSkeleton() {
  return (
    <AppCard>
      <Skeleton className={layout.app.skeleton.caption} />
      <div className={layout.app.home.ring}>
        <Skeleton className={layout.app.skeleton.ring} />
      </div>
    </AppCard>
  );
}
