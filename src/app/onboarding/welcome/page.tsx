'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ParticleSphere } from '@/components/onboarding/ParticleSphere';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { Wordmark } from '@/components/onboarding/Wordmark';
import { COPY, ROUTES } from '@/config/onboarding-steps';
import { useOnboardingFlow } from '@/hooks/use-flow-navigation';

export default function WelcomePage() {
  const router = useRouter();
  const { goNext } = useOnboardingFlow('welcome');

  return (
    <ScreenShell
      center
      footer={
        <div className="space-y-3">
          <Button className="h-12 w-full text-base" size="lg" onClick={() => goNext()}>
            {COPY.welcome.primary}
          </Button>
          <Button
            variant="ghost"
            className="h-12 w-full text-base"
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
