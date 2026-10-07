'use client';

import { Clock, Flame, Target, Zap } from 'lucide-react';

import { ProfileAvatar } from '@/components/app/ProfileAvatar';
import { ProfileLinks } from '@/components/app/ProfileLinks';
import { PROFILE_COPY } from '@/config/profile';
import { formatProfileDate } from '@/lib/profile-date';
import { formatStreakDays } from '@/lib/study-time';
import { ProfilePlanCard } from '@/components/paywall/ProfilePlanCard';
import { StatTile } from '@/components/app/StatTile';
import { StreakCalendar } from '@/components/app/StreakCalendar';
import { ErrorNote } from '@/components/common/ErrorNote';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Skeleton } from '@/components/ui/skeleton';
import { profileSkeletonTiles } from '@/config/app-layout';
import { layout } from '@/config/layout';
import { COPY, GOAL_OPTIONS } from '@/config/onboarding-steps';
import { useProfile } from '@/hooks/use-profile';
import { LEARNING_COPY as C, LEARNING_ROUTES } from '@/config/integration';
import Link from 'next/link';
import { useUserStats } from '@/hooks/use-user-stats';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

// Вкладка «Профиль»: витрина - личность, строка «Настройки» → экран правки,
// сетка «Обзор» и неделя в ударе. Живую сессию гарантирует AppGuard.
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { stats, failed, retry } = useUserStats();
  const profile = useProfile();
  const nameOverride = useProfileStore((s) => s.name);

  if (!user) return null;

  const displayName = profile.data?.displayName ?? nameOverride ?? user.displayName ?? user.email;
  const goal = stats ? GOAL_OPTIONS.find((option) => option.id === stats.goalId) : undefined;

  return (
    <ScreenShell bottomNavigation scrollPage className={layout.app.profile.shell}>
      <div className={layout.app.profile.content}>
        <div className={layout.app.profile.group}>
          <div className={layout.app.profile.identity}>
            <ProfileAvatar url={profile.data?.avatarUrl} />
            <ScreenHeading variant="app" title={displayName} />
            {profile.data ? (
              <p className={layout.app.profile.joined}>
                {PROFILE_COPY.joined(formatProfileDate(profile.data.registeredAt))}
              </p>
            ) : null}
          </div>
          <ProfileLinks />
          {user.role === 'ADMIN' ? (
            <Link href={LEARNING_ROUTES.admin} className={layout.typography.description}>
              {C.admin}
            </Link>
          ) : null}
          <ProfilePlanCard />
        </div>
        <div className={layout.app.profile.group}>
          {stats ? (
            <>
              <div className={layout.app.profile.section}>
                <SectionHeading>{COPY.profile.overviewTitle}</SectionHeading>
                <div className={layout.app.profile.grid}>
                  <StatTile
                    icon={Flame}
                    label={COPY.profile.overviewStreak}
                    value={formatStreakDays(stats.streakDays)}
                  />
                  <StatTile
                    icon={Clock}
                    label={COPY.home.studyTimeLabel}
                    value={stats.studyTimeLabel}
                  />
                  <StatTile
                    icon={Target}
                    label={COPY.profile.overviewGoal}
                    value={goal?.description ?? PROFILE_COPY.goalUnset}
                  />
                  <StatTile
                    icon={Zap}
                    label={COPY.profile.overviewDailyGoal}
                    value={`${stats.dailyGoalMinutes} ${COPY.profile.dailyGoalUnit}`}
                  />
                </div>
              </div>

              <div className={layout.app.profile.calendarSection}>
                <SectionHeading>{COPY.profile.streakWeekTitle}</SectionHeading>
                <StreakCalendar week={stats.week} today={stats.date} />
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
      </div>
    </ScreenShell>
  );
}
