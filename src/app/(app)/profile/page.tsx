'use client';

import { ChevronRight, Clock, Flame, Settings, Target, UserRound, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AppCard } from '@/components/app/AppCard';
import { StatTile } from '@/components/app/StatTile';
import { StreakCalendar } from '@/components/app/StreakCalendar';
import { ErrorNote } from '@/components/common/ErrorNote';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Skeleton } from '@/components/ui/skeleton';
import { profileSkeletonTiles } from '@/config/app-layout';
import { layout } from '@/config/layout';
import { COPY, GOAL_OPTIONS, ROUTES } from '@/config/onboarding-steps';
import { usePlan } from '@/hooks/use-plan';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/use-user-stats';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

// Вкладка «Профиль»: витрина - личность, строка «Настройки» → экран правки,
// сетка «Обзор» и неделя в ударе. Живую сессию гарантирует AppGuard.
export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { stats, failed, retry } = useUserStats();
  const plan = usePlan();
  const nameOverride = useProfileStore((s) => s.name);

  if (!user) return null;

  const displayName = nameOverride ?? user.displayName ?? user.email;
  const goal = stats ? GOAL_OPTIONS.find((option) => option.id === stats.goalId) : undefined;

  return (
    <ScreenShell bottomNavigation>
      <div className={cn(layout.scroll, layout.app.profile.content)}>
        <div className={layout.app.profile.identity}>
          <div className={layout.app.profile.avatar}>
            <UserRound className={layout.app.profile.avatarIcon} />
          </div>
          <ScreenHeading variant="app" title={displayName} />
          <p className={cn(layout.typography.description, layout.app.profile.email)}>
            {user.email}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(ROUTES.settings)}
          className={cn(layout.app.card.surface, layout.app.profile.settings, layout.focusRing)}
        >
          <Settings className={layout.app.profile.settingsIcon} />
          <span className={cn(layout.app.profile.settingsLabel, layout.typography.controlTitle)}>
            {COPY.profile.settingsRow}
          </span>
          <ChevronRight className={layout.app.profile.settingsIcon} />
        </button>

        <AppCard className={layout.app.card.compact}>
          <p className={layout.typography.description}>{COPY.plan.cardTitle}</p>
          <p className={layout.typography.sectionTitle}>{plan.label}</p>
          <p className={layout.typography.description}>{plan.description}</p>
        </AppCard>

        {stats ? (
          <>
            <div className={layout.app.profile.section}>
              <SectionHeading>{COPY.profile.overviewTitle}</SectionHeading>
              <div className={layout.app.profile.grid}>
                <StatTile
                  icon={Flame}
                  label={COPY.profile.overviewStreak}
                  value={`${stats.streakDays} ${COPY.profile.streakUnit}`}
                />
                <StatTile
                  icon={Zap}
                  label={COPY.profile.overviewXp}
                  value={`${stats.xp} ${COPY.home.xpUnit}`}
                />
                <StatTile
                  icon={Target}
                  label={COPY.profile.overviewGoal}
                  value={goal?.description ?? '-'}
                />
                <StatTile
                  icon={Clock}
                  label={COPY.profile.overviewDailyGoal}
                  value={`${stats.dailyGoalMinutes} ${COPY.profile.dailyGoalUnit}`}
                />
              </div>
            </div>

            <div className={layout.app.profile.section}>
              <SectionHeading>{COPY.profile.streakWeekTitle}</SectionHeading>
              <StreakCalendar streakDays={stats.streakDays} />
            </div>
          </>
        ) : failed ? (
          <ErrorNote message={COPY.errors.stats} onRetry={retry} />
        ) : (
          <div className={layout.app.profile.grid}>
            {profileSkeletonTiles.map((tile) => (
              <Skeleton key={tile} className={layout.app.profile.skeleton} />
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
