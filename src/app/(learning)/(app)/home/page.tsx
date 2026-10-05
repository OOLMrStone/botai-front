'use client';

import { AppCard, AppCardHeading } from '@/components/app/AppCard';
import { DailyGoalRing, DailyGoalRingSkeleton } from '@/components/app/DailyGoalRing';
import { SavedAttempts } from '@/components/app/SavedAttempts';
import { HomeStatusBar, HomeStatusBarSkeleton } from '@/components/app/HomeStatusBar';
import { PlanGate } from '@/components/app/PlanGate';
import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useUserStats } from '@/hooks/use-user-stats';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

// Главная восстанавливает все незавершённые серверные попытки.
export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const { stats, failed, retry } = useUserStats();
  const nameOverride = useProfileStore((s) => s.name);

  const name = nameOverride ?? user?.displayName ?? user?.email ?? '';
  const loading = !stats && !failed;

  return (
    <ScreenShell bottomNavigation scrollPage>
      <div className={layout.app.home.content}>
        <div className={layout.app.home.header}>
          {stats ? (
            <HomeStatusBar streakDays={stats.streakDays} studyHours={stats.studyHours} />
          ) : loading ? (
            <HomeStatusBarSkeleton />
          ) : null}
          <ScreenHeading
            variant="app"
            title={`${COPY.home.greeting}, ${name}!`}
            subtitle={COPY.home.tagline}
          />
        </div>

        {failed ? <ErrorNote message={COPY.errors.stats} onRetry={retry} /> : null}

        <div className={layout.app.home.cards}>
          {stats ? (
            <DailyGoalRing
              progressMinutes={stats.dailyProgressMinutes}
              goalMinutes={stats.dailyGoalMinutes}
              className={layout.app.home.goalCard}
            />
          ) : loading ? (
            <DailyGoalRingSkeleton className={layout.app.home.goalCard} />
          ) : null}

          <SavedAttempts />

          <AppCard className={layout.app.home.reviewCard}>
            <AppCardHeading title={COPY.home.aiReviewTitle} subtitle={COPY.home.aiReviewSubtitle} />
            <PlanGate feature="aiReview">
              <p className={layout.typography.description}>{COPY.home.aiReviewOn}</p>
            </PlanGate>
          </AppCard>
        </div>
      </div>
    </ScreenShell>
  );
}
