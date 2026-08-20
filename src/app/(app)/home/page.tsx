'use client';

import { useRouter } from 'next/navigation';

import { DailyGoalRing } from '@/components/app/DailyGoalRing';
import { DailyTaskCard } from '@/components/app/DailyTaskCard';
import { HomeStatusBar } from '@/components/app/HomeStatusBar';
import { PlanGate } from '@/components/app/PlanGate';
import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { useDailyTask } from '@/hooks/use-daily-task';
import { useUserStats } from '@/hooks/use-user-stats';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { useTasksStore } from '@/stores/tasks-store';

// Хаб после логина: приветствие, статус (стрик/XP), кольцо дневной цели,
// задача дня, продолжение урока и платный разбор с ИИ.
export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { stats, failed, retry } = useUserStats();
  const { task } = useDailyTask();
  const nameOverride = useProfileStore((s) => s.name);
  const trainingSession = useTasksStore((s) => s.session);

  const name = nameOverride ?? user?.displayName ?? user?.email ?? '';
  const loading = !stats && !failed;

  return (
    <ScreenShell>
      {stats ? (
        <HomeStatusBar streakDays={stats.streakDays} xp={stats.xp} />
      ) : loading ? (
        <Skeleton className="h-9 w-full rounded-full" />
      ) : null}

      <ScreenHeading title={`${COPY.home.greeting}, ${name}!`} subtitle={COPY.home.tagline} />

      <div className={cn(layout.scroll, 'flex flex-col', layout.shell.gap)}>
        {failed ? <ErrorNote message={COPY.errors.stats} onRetry={retry} /> : null}

        {stats ? (
          <DailyGoalRing
            progressMinutes={stats.dailyProgressMinutes}
            goalMinutes={stats.dailyGoalMinutes}
          />
        ) : loading ? (
          <Skeleton className="size-40 shrink-0 self-center rounded-full" />
        ) : null}

        {task ? <DailyTaskCard task={task} /> : <Skeleton className="h-28 w-full rounded-2xl" />}

        <div className="border-border bg-card w-full shrink-0 space-y-3 rounded-2xl border p-4">
          <div className="space-y-1">
            <p className="font-semibold">
              {trainingSession ? COPY.home.continueTrainingTitle : COPY.home.continueTitle}
            </p>
            <p className="text-muted-foreground text-sm">
              {trainingSession ? COPY.home.continueTrainingSubtitle : COPY.home.continueSubtitle}
            </p>
          </div>
          <Button
            size="lg"
            className={layout.cta}
            onClick={() => router.push(trainingSession ? ROUTES.training : ROUTES.lesson)}
          >
            {COPY.home.continueAction}
          </Button>
        </div>

        <div className="border-border bg-card w-full shrink-0 space-y-2 rounded-2xl border p-4">
          <div className="space-y-1">
            <p className="font-semibold">{COPY.home.aiReviewTitle}</p>
            <p className="text-muted-foreground text-sm">{COPY.home.aiReviewSubtitle}</p>
          </div>
          <PlanGate feature="aiReview">
            <p className="text-sm font-medium">{COPY.home.aiReviewOn}</p>
          </PlanGate>
        </div>
      </div>
    </ScreenShell>
  );
}
