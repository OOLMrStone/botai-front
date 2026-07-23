'use client';

import { ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function ThankYouPage() {
  const { goNext } = useOnboardingFlow('thank-you');

  return (
    <ScreenShell
      center
      footer={
        <Button className={layout.cta} size="lg" onClick={() => goNext()}>
          {COPY.thankYou.action}
        </Button>
      }
    >
      <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-3xl">
        <ShieldCheck className="size-8" />
      </div>

      <ScreenHeading title={COPY.thankYou.title} />

      <div className="border-border w-full space-y-1 rounded-2xl border p-4 text-center">
        <p className="font-medium whitespace-pre-line">{COPY.thankYou.cardTitle}</p>
        <p className="text-muted-foreground text-sm text-balance whitespace-pre-line">
          {COPY.thankYou.cardText}
        </p>
      </div>
    </ScreenShell>
  );
}
