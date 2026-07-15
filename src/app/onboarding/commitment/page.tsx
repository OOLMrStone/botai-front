'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
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
      <ScreenHeading title={COPY.commitment.title} />

      <p className="text-lg text-balance whitespace-pre-line">{COPY.commitment.subtitle}</p>

      {/* Блок подписи чуть отступает от текста, свободное место остаётся снизу - у кнопки. */}
      <div className="mt-10 space-y-3">
        <p className="text-muted-foreground text-center">{COPY.commitment.signHint}</p>
        <SignaturePad onSignedChange={setSigned} />
        <p className="text-muted-foreground text-center text-xs" suppressHydrationWarning>
          {COPY.commitment.signedPrefix} {today}
        </p>
      </div>
    </ScreenShell>
  );
}
