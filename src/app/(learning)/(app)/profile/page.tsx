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
import { COPY, GOAL_OPTIONS, LEVEL_OPTIONS, ROUTES } from '@/config/onboarding-steps';
import { useProfile } from '@/hooks/use-profile';
import {
  LEARNING_COPY as C,
  DATE_FORMAT,
  LEARNING_ROUTES,
  INTEGRATION,
} from '@/config/integration';
import { FileUploadButton } from '@/components/common/FileUploadButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
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
            <div className={layout.app.profile.avatar}>
              <>
                {profile.data?.avatarUrl ? (
                  <Image
                    src={profile.data.avatarUrl}
                    alt={C.avatar}
                    width={128}
                    height={128}
                    className={layout.integration.avatarImage}
                  />
                ) : (
                  <UserRound className={layout.app.profile.avatarIcon} />
                )}
              </>
            </div>
            <ScreenHeading variant="app" title={displayName} />
            <p className={cn(layout.typography.description, layout.app.profile.email)}>
              {user.email}
            </p>
          </div>

          {profile.data ? (
            <>
              <p className={layout.typography.caption}>
                {C.registered} {DATE_FORMAT.format(new Date(profile.data.registeredAt))}
              </p>
              <p className={layout.typography.description}>
                {C.level}:{' '}
                {LEVEL_OPTIONS.find((option) => option.id === profile.data?.levelId)?.label ?? '-'}
              </p>
            </>
          ) : null}
          <FileUploadButton
            label={C.changeAvatar}
            accept={INTEGRATION.imageAccept}
            disabled={profile.busy}
            onAdd={(files) => {
              if (files[0]) void profile.avatar(files[0]);
            }}
          />
          {user.emailVerified === false ? (
            <Button
              variant="outline"
              disabled={profile.verificationBusy || profile.verificationSent}
              onClick={() => void profile.verify()}
            >
              {profile.verificationSent ? C.verifySent : C.verify}
            </Button>
          ) : null}
          {profile.data?.avatarUrl ? (
            <Button variant="outline" disabled={profile.busy} onClick={() => void profile.avatar()}>
              {C.removeAvatar}
            </Button>
          ) : null}
          {profile.error ? <ErrorNote message={profile.error} /> : null}
          {user.role === 'ADMIN' ? (
            <Link href={LEARNING_ROUTES.admin} className={layout.typography.description}>
              {C.admin}
            </Link>
          ) : null}
          <Link href={LEARNING_ROUTES.history} className={layout.typography.description}>
            {C.history}
          </Link>
          <button
            type="button"
            onClick={() => router.push(ROUTES.settings)}
            className={cn(
              layout.app.card.surface,
              layout.app.profile.card,
              layout.app.profile.settings,
              layout.focusRing,
            )}
          >
            <Settings className={layout.app.profile.settingsIcon} />
            <span className={cn(layout.app.profile.settingsLabel, layout.typography.controlTitle)}>
              {COPY.profile.settingsRow}
            </span>
            <ChevronRight className={layout.app.profile.settingsIcon} />
          </button>

          <AppCard className={cn(layout.app.card.compact, layout.app.profile.card)}>
            <p className={layout.typography.description}>{COPY.plan.cardTitle}</p>
            <p className={layout.typography.sectionTitle}>{plan.label}</p>
            <p className={layout.typography.description}>{plan.description}</p>
          </AppCard>
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
                    value={`${stats.streakDays} ${COPY.profile.streakUnit}`}
                  />
                  <StatTile
                    icon={Clock}
                    label={COPY.home.studyTimeLabel}
                    value={`${stats.studyHours} ${COPY.home.hoursUnit}`}
                  />
                  <StatTile
                    icon={Target}
                    label={COPY.profile.overviewGoal}
                    value={goal?.description ?? '-'}
                  />
                  <StatTile
                    icon={Zap}
                    label={COPY.profile.overviewDailyGoal}
                    value={`${stats.dailyGoalMinutes} ${COPY.profile.dailyGoalUnit}`}
                  />
                </div>
              </div>

              <div className={layout.app.profile.section}>
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
