'use client';

import { useRouter } from 'next/navigation';

import { ResultScreen } from '@/components/onboarding/ResultScreen';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { saveOnboarding } from '@/lib/api/onboarding';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function DonePage() {
  const router = useRouter();
  const goal = useOnboardingStore((s) => s.goal);
  const level = useOnboardingStore((s) => s.level);
  const dailyGoalMinutes = useOnboardingStore((s) => s.dailyGoalMinutes);
  const notificationsEnabled = useOnboardingStore((s) => s.notificationsEnabled);
  const reset = useOnboardingStore((s) => s.reset);

  const finish = () => {
    void saveOnboarding({ goal, level, dailyGoalMinutes, notificationsEnabled });
    reset();

    router.push(ROUTES.lesson);
  };

  return (
    <ResultScreen
      title={COPY.register.done.title}
      subtitle={COPY.register.done.subtitle}
      actionLabel={COPY.register.done.action}
      onAction={finish}
    />
  );
}
