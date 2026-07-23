'use client';

import { ChevronRight, Clock, Flame, Settings, Target, UserRound, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { StatTile } from '@/components/app/StatTile';
import { StreakCalendar } from '@/components/app/StreakCalendar';
import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { layout } from '@/config/layout';
import { COPY, GOAL_OPTIONS, ROUTES } from '@/config/onboarding-steps';
import { usePlan } from '@/hooks/use-plan';
import { useUserStats } from '@/hooks/use-user-stats';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

// Вкладка «Профиль»: витрина - личность, строка «Настройки» → экран правки,
// сетка «Обзор» и неделя в ударе. Живую сессию гарантирует AppGuard.
export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { stats, failed, retry } = useUserStats();
  const plan = usePlan();
  const nameOverride = useProfileStore((s) => s.name);
  const [pending, setPending] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);

  if (!user) return null;

  const displayName = nameOverride ?? user.displayName ?? user.email;
  const goal = stats ? GOAL_OPTIONS.find((option) => option.id === stats.goalId) : undefined;

  const handleLogout = async () => {
    setPending(true);
    setLogoutFailed(false);
    try {
      await logout();
      router.replace(ROUTES.login);
    } catch {
      setLogoutFailed(true);
      setPending(false);
    }
  };

  return (
    <ScreenShell
      footer={
        <div className={layout.ctaStack}>
          {logoutFailed ? <ErrorNote message={COPY.errors.logout} /> : null}
          <Button className={layout.cta} size="lg" onClick={() => router.push(ROUTES.lesson)}>
            {COPY.profile.toLesson}
          </Button>
          <Button variant="ghost" className="w-full" disabled={pending} onClick={handleLogout}>
            {COPY.profile.logout}
          </Button>
        </div>
      }
    >
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-3xl">
            <UserRound className="size-8" />
          </div>
          <ScreenHeading title={displayName} />
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={() => router.push(ROUTES.settings)}
          className="border-border bg-card flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-transform active:scale-[0.99]"
        >
          <Settings className="text-muted-foreground size-5 shrink-0" />
          <span className="flex-1 font-medium">{COPY.profile.settingsRow}</span>
          <ChevronRight className="text-muted-foreground size-5 shrink-0" />
        </button>

        <div className="border-border bg-card w-full space-y-1 rounded-2xl border p-4">
          <p className="text-muted-foreground text-sm">{COPY.plan.cardTitle}</p>
          <p className="font-semibold">{plan.label}</p>
          <p className="text-muted-foreground text-sm">{plan.description}</p>
        </div>

        {stats ? (
          <>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">{COPY.profile.overviewTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  icon={Flame}
                  label={COPY.profile.overviewStreak}
                  value={`${stats.streakDays} ${COPY.profile.streakUnit}`}
                />
                <StatTile icon={Zap} label={COPY.profile.overviewXp} value={`${stats.xp} XP`} />
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

            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">{COPY.profile.streakWeekTitle}</p>
              <StreakCalendar streakDays={stats.streakDays} />
            </div>
          </>
        ) : failed ? (
          <ErrorNote message={COPY.errors.stats} onRetry={retry} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((tile) => (
              <Skeleton key={tile} className="h-20 rounded-2xl" />
            ))}
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
