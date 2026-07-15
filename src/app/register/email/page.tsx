'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ValidatedField } from '@/components/onboarding/ValidatedField';
import { COPY } from '@/config/onboarding-steps';
import { useRegisterFlow } from '@/hooks/use-flow-navigation';
import { isValidEmail } from '@/lib/validation';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function EmailPage() {
  const { goNext } = useRegisterFlow('email');
  const email = useOnboardingStore((s) => s.registration.email);
  const updateRegistration = useOnboardingStore((s) => s.updateRegistration);

  const valid = isValidEmail(email);

  return (
    <ScreenShell
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          disabled={!valid}
          onClick={() => goNext()}
        >
          {COPY.register.email.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.register.email.title} />

      <div className="space-y-2">
        <Label htmlFor="email">Почта</Label>
        <ValidatedField
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(value) => updateRegistration({ email: value })}
          validate={isValidEmail}
          errorText={COPY.validation.email}
          className="h-12 text-base"
        />
      </div>
    </ScreenShell>
  );
}
