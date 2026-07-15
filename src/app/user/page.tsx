'use client';

import { UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ScreenTransition } from '@/components/onboarding/ScreenTransition';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { useAuthStore } from '@/stores/auth-store';

// Профиль: доказательство живой сессии. Данные приходят из GET /api/auth/me
// по куке SESSION - страница работает и после перезапуска приложения.
export default function UserPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const refresh = useAuthStore((s) => s.refresh);
  const logout = useAuthStore((s) => s.logout);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === 'unknown') void refresh();
  }, [status, refresh]);

  useEffect(() => {
    if (status === 'anonymous') router.replace(ROUTES.login);
  }, [status, router]);

  const handleLogout = async () => {
    setPending(true);
    try {
      await logout();
      router.replace(ROUTES.login);
    } catch {
      setPending(false);
    }
  };

  if (status !== 'authenticated' || !user) {
    return (
      <ScreenShell center>
        <p className="text-muted-foreground">{COPY.user.loading}</p>
      </ScreenShell>
    );
  }

  return (
    <ScreenTransition>
      <ScreenShell
        center
        footer={
          <div className="space-y-2">
            <Button
              className="h-12 w-full text-base"
              size="lg"
              onClick={() => router.push(ROUTES.lesson)}
            >
              {COPY.user.toLesson}
            </Button>
            <Button variant="ghost" className="w-full" disabled={pending} onClick={handleLogout}>
              {COPY.user.logout}
            </Button>
          </div>
        }
      >
        <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-3xl">
          <UserRound className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {COPY.user.greeting}, {user.displayName ?? user.email}!
          </h1>
          <p className="text-muted-foreground text-balance">{COPY.user.subtitle}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </ScreenShell>
    </ScreenTransition>
  );
}
