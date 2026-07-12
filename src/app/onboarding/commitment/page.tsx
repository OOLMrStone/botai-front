'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { SignaturePad } from '@/components/onboarding/SignaturePad';
import { COPY } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

const DATE_FMT = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function CommitmentPage() {
  const { goNext } = useOnboardingFlow('commitment');
  const [signed, setSigned] = useState(false);

  const today = DATE_FMT.format(new Date());

  return (
    <ScreenShell
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          disabled={!signed}
          onClick={() => goNext()}
        >
          {COPY.commitment.action}
        </Button>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance whitespace-pre-line">
          {COPY.commitment.title}
        </h1>
        <p className="text-muted-foreground text-balance whitespace-pre-line">
          {COPY.commitment.subtitle}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-muted-foreground text-center text-sm whitespace-pre-line">
          {COPY.commitment.signHint}
        </p>
        <SignaturePad onSignedChange={setSigned} />
        <p className="text-muted-foreground text-center text-xs" suppressHydrationWarning>
          {COPY.commitment.signedPrefix} {today}
        </p>
      </div>
    </ScreenShell>
  );
}
