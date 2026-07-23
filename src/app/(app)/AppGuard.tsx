'use client';

import { COPY } from '@/config/onboarding-steps';
import { useRequireAuth } from '@/hooks/use-require-auth';

// Гард раздела (app): пускаем только с живой сессией (логика в use-require-auth,
// общая с экраном настроек). Серверного middleware нет, проверка клиентская.
export function AppGuard({ children }: { children: React.ReactNode }) {
  const status = useRequireAuth();

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-muted-foreground">{COPY.profile.loading}</p>
      </div>
    );
  }

  return <>{children}</>;
}
