'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ProfileEditFields } from '@/components/app/ProfileEditFields';
import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useLogout } from '@/hooks/use-logout';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useUserStats } from '@/hooks/use-user-stats';
import { updateProfileSettings } from '@/lib/api/profile';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';

// Экран настроек (вне таб-бара, свой back): обращение, цель дня, цель по ЕГЭ.
// Открывается из профиля. Гард сессии - use-require-auth, как в AppGuard.
export default function SettingsPage() {
  const router = useRouter();
  const status = useRequireAuth();
  const { logout, pending: loggingOut, failed: logoutFailed } = useLogout();
  const user = useAuthStore((s) => s.user);
  const { stats, failed, retry } = useUserStats();
  const nameOverride = useProfileStore((s) => s.name);
  const updateProfile = useProfileStore((s) => s.update);

  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [goalDraft, setGoalDraft] = useState<string | null>(null);
  const [minutesDraft, setMinutesDraft] = useState<number | null>(null);

  if (status !== 'authenticated' || !user || !stats) {
    return (
      <div className="flex h-svh flex-col items-center justify-center px-6">
        {failed ? (
          <ErrorNote message={COPY.errors.stats} onRetry={retry} />
        ) : (
          <p className="text-muted-foreground">{COPY.profile.loading}</p>
        )}
      </div>
    );
  }

  const name = nameDraft ?? nameOverride ?? user.displayName ?? '';
  const goalId = goalDraft ?? stats.goalId;
  const minutes = minutesDraft ?? stats.dailyGoalMinutes;

  const handleSave = async () => {
    const patch = { name: name.trim() || null, goalId, dailyGoalMinutes: minutes };

    setSaving(true);
    setSaveFailed(false);
    try {
      await updateProfileSettings(patch);
      updateProfile(patch);
      router.back();
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={layout.settings.shell}>
      <header className={layout.settings.header}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={COPY.nav.back}
          className={layout.settings.backButton}
        >
          <ChevronLeft className={layout.settings.backIcon} />
        </button>
        <ScreenHeading variant="navigation" title={COPY.settings.title} />
      </header>

      <div className={cn(layout.scroll, layout.settings.content, layout.shell.padX)}>
        <ProfileEditFields
          name={name}
          onNameChange={setNameDraft}
          goalId={goalId}
          onGoalChange={setGoalDraft}
          dailyMinutes={minutes}
          onDailyChange={setMinutesDraft}
        />
        <div className={layout.settings.logoutSection}>
          {logoutFailed ? <ErrorNote message={COPY.errors.logout} /> : null}
          <Button
            variant="ghost"
            className={cn(layout.settings.logoutAction, layout.typography.controlTitle)}
            disabled={saving || loggingOut}
            onClick={logout}
          >
            {COPY.settings.logout}
          </Button>
        </div>
      </div>

      <div className={cn(layout.settings.footer, layout.shell.padX, layout.shell.padBottom)}>
        {saveFailed ? <ErrorNote message={COPY.errors.save} /> : null}
        <Button
          className={layout.cta}
          size="lg"
          disabled={saving || loggingOut}
          onClick={handleSave}
        >
          {COPY.settings.save}
        </Button>
      </div>
    </div>
  );
}
