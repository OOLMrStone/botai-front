'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ParticleSphere } from '@/components/onboarding/ParticleSphere';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Wordmark } from '@/components/onboarding/Wordmark';
import { layout } from '@/config/layout';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function WelcomePage() {
  const router = useRouter();
  const { goNext } = useOnboardingFlow('welcome');

  return (
    <ScreenShell
      center
      footer={
        <div className={layout.ctaStack}>
          <Button className={layout.cta} size="lg" onClick={() => goNext()}>
            {COPY.welcome.primary}
          </Button>
          <Button
            variant="ghost"
            className={layout.cta}
            size="lg"
            onClick={() => router.push(ROUTES.login)}
          >
            {COPY.welcome.secondary}
          </Button>
        </div>
      }
    >
      <ParticleSphere />

      <ScreenHeading title={<Wordmark />} subtitle={COPY.welcome.subtitle} />
    </ScreenShell>
  );
}
