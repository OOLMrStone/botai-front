'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
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
      <MascotPlaceholder />

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{COPY.welcome.title}</h1>
        <p className="text-muted-foreground text-balance whitespace-pre-line">
          {COPY.welcome.subtitle}
        </p>
      </div>
    </ScreenShell>
  );
}
