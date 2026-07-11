'use client';

import { ResultScreen } from '@/components/onboarding/ResultScreen';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function ReadyPage() {
  const { goNext } = useOnboardingFlow();

  return (
    <ResultScreen
      title={COPY.ready.title}
      subtitle={COPY.ready.subtitle}
      actionLabel={COPY.ready.action}
      onAction={() => goNext('ready')}
    />
  );
}
