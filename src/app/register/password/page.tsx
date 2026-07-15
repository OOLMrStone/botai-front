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
import { ApiError } from '@/lib/api/client';
import { isValidPassword } from '@/lib/validation';
import { useAuthStore } from '@/stores/auth-store';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function PasswordPage() {
  const { goNext } = useRegisterFlow('password');
  const registration = useOnboardingStore((s) => s.registration);
  const updateRegistration = useOnboardingStore((s) => s.updateRegistration);
  const setUser = useAuthStore((s) => s.setUser);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const password = registration.password;
  const valid = isValidPassword(password);

  const handleCreate = async () => {
    setPending(true);
    setError(null);

    try {
      // registerUser сразу логинит - пользователь уходит дальше уже с сессией.
      const user = await registerUser(registration);
      setUser(user);
      goNext();
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 409
          ? COPY.register.password.emailTaken
          : COPY.register.password.error,
      );
      setPending(false);
    }
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
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
      </div>
    </ScreenShell>
  );
}
