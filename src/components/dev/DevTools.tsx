'use client';

import { Wrench, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DEMO_ACCOUNT, DEV_COPY, DEV_DEMO_TASK_PATH, DEV_SCREENS } from '@/config/dev';
import { APP_ENV, IS_MOCK_API } from '@/config/env';
import { ROUTES } from '@/config/onboarding-steps';
import { PLAN_IDS, PLANS, type PlanId } from '@/config/plans';
import { useMockExamDemoControls } from '@/hooks/use-mock-exam-demo-controls';
import { loginUser } from '@/lib/api/auth';
import { changePlan } from '@/lib/api/billing';
import { normalizePlan } from '@/lib/plan';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useProfileStore } from '@/stores/profile-store';

// Инструмент разработчика: посмотреть, в какой мы сборке, войти тестовым
// аккаунтом, переключить тариф, сбросить состояние и прыгнуть на любой экран.
// В продовой сборке не рендерится и не грузится (см. DevToolsSlot).
export function DevTools() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={DEV_COPY.open}
        onClick={() => setOpen((value) => !value)}
        className="bg-foreground text-background fixed right-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 flex size-10 items-center justify-center rounded-full opacity-70 shadow-lg transition-opacity active:opacity-100"
      >
        {open ? <X className="size-4" /> : <Wrench className="size-4" />}
      </button>

      {open ? <DevPanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function DevPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const resetOnboarding = useOnboardingStore((s) => s.reset);
  const resetProfile = useProfileStore((s) => s.reset);
  const mockExamDemo = useMockExamDemoControls();
  const [note, setNote] = useState<string | null>(null);

  const plan = normalizePlan(user?.plan);

  // Уход на экран закрывает панель - она перекрывает то, что идём смотреть.
  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  // Действия панели одинаково сообщают об успехе и о провале - разработчик
  // видит результат, а не тихо упавший промис.
  const run = async (action: () => Promise<unknown>, done: string) => {
    try {
      await action();
      setNote(done);
    } catch {
      setNote(DEV_COPY.actionFailed);
    }
  };

  // Вход тестовым аккаунтом сразу уводит в приложение - тестировать после
  // нажатия нужно именно там, а не на экране, с которого панель открыли.
  const handleLogin = () =>
    run(async () => {
      setUser(await loginUser(DEMO_ACCOUNT));
      go(ROUTES.home);
    }, DEV_COPY.loginDone);

  const handlePlan = (next: PlanId) =>
    run(async () => setUser(await changePlan(next)), DEV_COPY.planDone);

  const handleOpenMockExam = () => {
    mockExamDemo.prepare();
    go(DEV_DEMO_TASK_PATH);
  };

  const handleReset = () => {
    resetOnboarding();
    resetProfile();
    setNote(DEV_COPY.resetDone);
  };

  return (
    <div className="bg-background/95 border-border fixed inset-x-2 bottom-[calc(8rem+env(safe-area-inset-bottom))] z-50 max-h-[60svh] space-y-4 overflow-y-auto rounded-2xl border p-4 text-sm shadow-xl backdrop-blur">
      <Section title={DEV_COPY.envTitle}>
        <p className="text-muted-foreground">
          {APP_ENV} · {IS_MOCK_API ? DEV_COPY.apiMock : DEV_COPY.apiReal}
        </p>
      </Section>

      <Section title={DEV_COPY.accountTitle}>
        <p className="text-muted-foreground">{user?.email ?? DEV_COPY.accountAnonymous}</p>
        <div className="flex gap-2">
          <Button size="compact" variant="outline" onClick={() => void handleLogin()}>
            {DEV_COPY.login}
          </Button>
          <Button
            size="compact"
            variant="ghost"
            onClick={() => void run(logout, DEV_COPY.logoutDone)}
          >
            {DEV_COPY.logout}
          </Button>
        </div>
      </Section>

      <Section title={DEV_COPY.planTitle}>
        <div className="flex gap-2">
          {PLAN_IDS.map((id) => (
            <Button
              key={id}
              size="compact"
              variant={id === plan ? 'default' : 'outline'}
              disabled={!user}
              onClick={() => void handlePlan(id)}
            >
              {PLANS[id].label}
            </Button>
          ))}
        </div>
      </Section>

      <Section title={DEV_COPY.resetTitle}>
        <Button size="compact" variant="outline" onClick={handleReset}>
          {DEV_COPY.resetAction}
        </Button>
      </Section>

      <Section title={DEV_COPY.resetMockExamTitle}>
        <div>
          <Button size="compact" variant="outline" onClick={handleOpenMockExam}>
            {DEV_COPY.openMockExamTask}
          </Button>
        </div>
        <Button
          size="compact"
          variant="outline"
          onClick={() => void run(mockExamDemo.reset, DEV_COPY.resetMockExamDone)}
        >
          {DEV_COPY.resetMockExamAction}
        </Button>
      </Section>

      <Section title={DEV_COPY.screensTitle}>
        <div className="flex flex-wrap gap-1.5">
          {DEV_SCREENS.map((screen) => (
            <button
              key={screen.href}
              type="button"
              onClick={() => go(screen.href)}
              className={cn(
                'border-border text-muted-foreground rounded-md border px-2 py-1 text-xs',
                'hover:bg-muted transition-colors',
              )}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </Section>

      {note ? <p className="text-muted-foreground text-xs">{note}</p> : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">{title}</p>
      {children}
    </div>
  );
}
