'use client';

import { Button } from '@/components/ui/button';
import { GoalChart } from '@/components/onboarding/GoalChart';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function GoalResultPage() {
  const { goNext } = useOnboardingFlow('goal-result');

  return (
    <ScreenShell
      center
      footer={
        <Button className="h-12 w-full text-base" size="lg" onClick={() => goNext()}>
          {COPY.goalResult.action}
        </Button>
      }
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-balance whitespace-pre-line">
        {COPY.goalResult.title}
      </h1>

      <GoalChart />
    </ScreenShell>
  );
}
