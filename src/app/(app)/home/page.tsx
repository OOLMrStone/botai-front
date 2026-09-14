'use client';

import { useRouter } from 'next/navigation';

import { AppCard, AppCardHeading } from '@/components/app/AppCard';
import { DailyGoalRing, DailyGoalRingSkeleton } from '@/components/app/DailyGoalRing';
import { DailyTaskCard, DailyTaskCardSkeleton } from '@/components/app/DailyTaskCard';
import { HomeStatusBar, HomeStatusBarSkeleton } from '@/components/app/HomeStatusBar';
import { PlanGate } from '@/components/app/PlanGate';
import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Button } from '@/components/ui/button';
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
  const { task, failed: taskFailed, retry: retryTask } = useDailyTask();
  const nameOverride = useProfileStore((s) => s.name);
  const trainingSession = useTasksStore((s) => s.session);

  const name = nameOverride ?? user?.displayName ?? user?.email ?? '';
  const loading = !stats && !failed;

  return (
    <ScreenShell bottomNavigation>
      <div className={cn(layout.scroll, layout.app.home.content)}>
        {stats ? (
          <HomeStatusBar streakDays={stats.streakDays} xp={stats.xp} />
        ) : loading ? (
          <HomeStatusBarSkeleton />
        ) : null}
        <ScreenHeading
          variant="app"
          title={`${COPY.home.greeting}, ${name}!`}
          subtitle={COPY.home.tagline}
        />

        {failed ? <ErrorNote message={COPY.errors.stats} onRetry={retry} /> : null}

        {stats ? (
          <DailyGoalRing
            progressMinutes={stats.dailyProgressMinutes}
            goalMinutes={stats.dailyGoalMinutes}
          />
        ) : loading ? (
          <DailyGoalRingSkeleton />
        ) : null}

        {task ? (
          <DailyTaskCard key={task.id} task={task} />
        ) : taskFailed ? (
          <ErrorNote message={COPY.errors.stats} onRetry={retryTask} />
        ) : (
          <DailyTaskCardSkeleton />
        )}

        <AppCard>
          <AppCardHeading
            title={trainingSession ? COPY.home.continueTrainingTitle : COPY.home.continueTitle}
            subtitle={
              trainingSession ? COPY.home.continueTrainingSubtitle : COPY.home.continueSubtitle
            }
          />
          <Button
            size="lg"
            className={layout.cta}
            onClick={() => router.push(trainingSession ? ROUTES.training : ROUTES.lesson)}
          >
            {COPY.home.continueAction}
          </Button>
        </AppCard>

        <AppCard>
          <AppCardHeading title={COPY.home.aiReviewTitle} subtitle={COPY.home.aiReviewSubtitle} />
          <PlanGate feature="aiReview">
            <p className={layout.typography.description}>{COPY.home.aiReviewOn}</p>
          </PlanGate>
        </AppCard>
      </div>
    </ScreenShell>
  );
}
