'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ValidatedField } from '@/components/onboarding/ValidatedField';
import { COPY } from '@/config/onboarding-steps';
import { useRegisterFlow } from '@/hooks/use-flow-navigation';
import { registerUser } from '@/lib/api/auth';
import { isValidPassword } from '@/lib/validation';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function PasswordPage() {
  const { goNext } = useRegisterFlow('password');
  const registration = useOnboardingStore((s) => s.registration);
  const updateRegistration = useOnboardingStore((s) => s.updateRegistration);
  const [pending, setPending] = useState(false);

  const password = registration.password;
  const valid = isValidPassword(password);

  const handleCreate = async () => {
    setPending(true);

    await registerUser(registration);

    goNext();
  };

  return (
    <ScreenShell
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          disabled={!valid || pending}
          onClick={handleCreate}
        >
          {COPY.register.password.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.register.password.title} />

      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <ValidatedField
          id="password"
          type="password"
          autoComplete="new-password"
          autoFocus
          value={password}
          onChange={(value) => updateRegistration({ password: value })}
          validate={isValidPassword}
          errorText={COPY.validation.password}
          className="h-12 text-base"
        />
      </div>
    </ScreenShell>
  );
}
