'use client';

import { Button } from '@/components/ui/button';
import { HighlightText } from '@/components/onboarding/HighlightText';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function IntroQuestionsPage() {
  const { goNext } = useOnboardingFlow('intro-questions');

  return (
    <ScreenShell
      center
      footer={
        <Button className={layout.cta} size="lg" onClick={() => goNext()}>
          {COPY.introQuestions.action}
        </Button>
      }
    >
      <ScreenHeading
        title={<HighlightText text={COPY.introQuestions.title} />}
        subtitle={COPY.introQuestions.subtitle}
      />
    </ScreenShell>
  );
}
