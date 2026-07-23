'use client';

import { useRouter } from 'next/navigation';

import { DailyGoalRing } from '@/components/app/DailyGoalRing';
import { PlanGate } from '@/components/app/PlanGate';
import { ErrorNote } from '@/components/common/ErrorNote';
import { HomeStatusBar } from '@/components/app/HomeStatusBar';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY, GOAL_OPTIONS, LEVEL_OPTIONS, ROUTES } from '@/config/onboarding-steps';
import { useUserStats } from '@/hooks/use-user-stats';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

// Хаб после логина: приветствие, статус (стрик/XP), кольцо дневной цели,
// продолжение урока и карточка цели. Данные - из стора авторизации и useUserStats.
export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { stats, failed, retry } = useUserStats();
  const nameOverride = useProfileStore((s) => s.name);

  const name = nameOverride ?? user?.displayName ?? user?.email ?? '';
  const loading = !stats && !failed;

  // Пока статистики нет - в карточке цели прочерк, сама карточка не мигает.
  const goalDescription = GOAL_OPTIONS.find((o) => o.id === stats?.goalId)?.description ?? '-';
  const levelLabel = LEVEL_OPTIONS.find((o) => o.id === stats?.levelId)?.label ?? '-';

  return (
    <ScreenShell>
      {stats ? (
        <HomeStatusBar streakDays={stats.streakDays} xp={stats.xp} />
      ) : loading ? (
        <Skeleton className="h-9 w-full rounded-full" />
      ) : null}

      <ScreenHeading title={`${COPY.home.greeting}, ${name}!`} subtitle={COPY.home.tagline} />

      {failed ? <ErrorNote message={COPY.errors.stats} onRetry={retry} /> : null}

      {stats ? (
        <DailyGoalRing
          progressMinutes={stats.dailyProgressMinutes}
          goalMinutes={stats.dailyGoalMinutes}
        />
      ) : loading ? (
        <Skeleton className="size-40 shrink-0 rounded-full" />
      ) : null}

      <div className="border-border bg-card w-full space-y-3 rounded-2xl border p-4">
        <div className="space-y-1">
          <p className="font-semibold">{COPY.home.continueTitle}</p>
          <p className="text-muted-foreground text-sm">{COPY.home.continueSubtitle}</p>
        </div>
        <Button size="lg" className={layout.cta} onClick={() => router.push(ROUTES.lesson)}>
          {COPY.home.continueAction}
        </Button>
      </div>

      <div className="border-border bg-card w-full space-y-2 rounded-2xl border p-4">
        <div className="space-y-1">
          <p className="font-semibold">{COPY.home.aiReviewTitle}</p>
          <p className="text-muted-foreground text-sm">{COPY.home.aiReviewSubtitle}</p>
        </div>
        <PlanGate feature="aiReview">
          <p className="text-sm font-medium">{COPY.home.aiReviewOn}</p>
        </PlanGate>
      </div>

      <div className="border-border bg-card w-full space-y-1 rounded-2xl border p-4">
        <p className="text-muted-foreground text-sm">{COPY.home.goalCardTitle}</p>
        <p className="font-semibold">{goalDescription}</p>
        <p className="text-muted-foreground text-sm">{`${COPY.home.goalCardLevelPrefix}: ${levelLabel}`}</p>
      </div>
    </ScreenShell>
  );
}
