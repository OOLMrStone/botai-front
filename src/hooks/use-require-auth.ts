'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/config/onboarding-steps';
import { useAuthStore, type AuthStatus } from '@/stores/auth-store';

// Гард сессии для раздела после логина: при неизвестном статусе спрашивает бэкенд
// «кто я», анонима уводит на /login. Возвращает статус - экран сам решает, что
// показать, пока не 'authenticated'. Один источник правды для AppGuard и настроек.
export function useRequireAuth(): AuthStatus {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    if (status === 'unknown') void refresh();
  }, [status, refresh]);

  useEffect(() => {
    if (status === 'anonymous') router.replace(ROUTES.login);
  }, [status, router]);

  return status;
}
