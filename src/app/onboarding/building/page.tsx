'use client';

import { useEffect } from 'react';

import { BuildingLoader } from '@/components/onboarding/BuildingLoader';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';
import { buildCourse } from '@/lib/api/onboarding';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function BuildingPage() {
  const { goNext } = useOnboardingFlow();
  const { goal, level, dailyGoalMinutes, notificationsEnabled } = useOnboardingStore();

  useEffect(() => {
    // Фейковый вызов сборки курса — навигацией управляет таймер лоадера.
    void buildCourse({ goal, level, dailyGoalMinutes, notificationsEnabled });
  }, [goal, level, dailyGoalMinutes, notificationsEnabled]);

  // replace, чтобы «назад» не возвращало в лоадер.
  return (
    <BuildingLoader
      title={COPY.building.title}
      subtitle={COPY.building.subtitle}
      onDone={() => goNext('building', { replace: true })}
    />
  );
}
