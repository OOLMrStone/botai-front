'use client';

import { Button } from '@/components/ui/button';
import { GoalChart } from '@/components/onboarding/GoalChart';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function GoalResultPage() {
  const { goNext } = useOnboardingFlow('goal-result');

  return (
    <ScreenShell
      center
      footer={
        <Button className={layout.cta} size="lg" onClick={() => goNext()}>
          {COPY.goalResult.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.goalResult.title} />

      <GoalChart />
    </ScreenShell>
  );
}
