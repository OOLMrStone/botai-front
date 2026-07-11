'use client';

import { ResultScreen } from '@/components/onboarding/ResultScreen';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function IntroPage() {
  const { goNext } = useOnboardingFlow();

  return (
    <ResultScreen
      title={COPY.intro.title}
      subtitle={COPY.intro.subtitle}
      actionLabel={COPY.intro.action}
      onAction={() => goNext('intro')}
    />
  );
}
