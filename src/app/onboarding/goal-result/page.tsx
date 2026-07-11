'use client';

import { ResultScreen } from '@/components/onboarding/ResultScreen';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function GoalResultPage() {
  const { goNext } = useOnboardingFlow();

  return (
    <ResultScreen
      title={COPY.goalResult.title}
      actionLabel={COPY.goalResult.action}
      onAction={() => goNext('goal-result')}
    />
  );
}
