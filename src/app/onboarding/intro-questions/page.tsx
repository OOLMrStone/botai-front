'use client';

import { Button } from '@/components/ui/button';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function IntroQuestionsPage() {
  const { goNext } = useOnboardingFlow();

  return (
    <ScreenShell
      center
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          onClick={() => goNext('intro-questions')}
        >
          {COPY.introQuestions.action}
        </Button>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          {COPY.introQuestions.lead} <span className="italic">{COPY.introQuestions.highlight}</span>
        </h1>
        <p className="text-muted-foreground text-balance">{COPY.introQuestions.subtitle}</p>
      </div>
    </ScreenShell>
  );
}
