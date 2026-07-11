'use client';

import { useRouter } from 'next/navigation';

import {
  nextOnboardingSlug,
  nextRegisterSlug,
  onboardingPath,
  registerPath,
  ROUTES,
} from '@/config/onboarding-steps';

interface GoNextOptions {
  replace?: boolean;
}

// Экран знает только своё имя и просит «дальше»; порядок берётся из конфига.
function useStepFlow<S extends string>(
  next: (slug: S) => S | null,
  toPath: (slug: S) => string,
  exitRoute: string,
) {
  const router = useRouter();

  const goNext = (current: S, { replace = false }: GoNextOptions = {}) => {
    const upcoming = next(current);
    const href = upcoming ? toPath(upcoming) : exitRoute;

    if (replace) router.replace(href);
    else router.push(href);
  };

  return { goNext };
}

export const useOnboardingFlow = () =>
  useStepFlow(nextOnboardingSlug, onboardingPath, ROUTES.lesson);

export const useRegisterFlow = () => useStepFlow(nextRegisterSlug, registerPath, ROUTES.done);
