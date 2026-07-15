'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { onboardingPath, ROUTES } from '@/config/onboarding-steps';
import { useAuthStore } from '@/stores/auth-store';

// Точка входа: если сессия жива (кука SESSION валидна) - сразу в профиль,
// иначе - в онбординг.
export default function Home() {
  const router = useRouter();
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    refresh()
      .then((user) => router.replace(user ? ROUTES.user : onboardingPath('welcome')))
      .catch(() => router.replace(onboardingPath('welcome')));
  }, [refresh, router]);

  return null;
}
