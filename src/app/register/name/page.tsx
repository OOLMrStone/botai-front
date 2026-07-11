'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';
import { useRegisterFlow } from '@/hooks/use-flow-navigation';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function NamePage() {
  const { goNext } = useRegisterFlow();
  const { firstName, lastName } = useOnboardingStore((s) => s.registration);
  const updateRegistration = useOnboardingStore((s) => s.updateRegistration);

  const valid = firstName.trim() !== '' && lastName.trim() !== '';

  return (
    <ScreenShell
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          disabled={!valid}
          onClick={() => goNext('name')}
        >
          {COPY.register.name.action}
        </Button>
      }
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{COPY.register.name.title}</h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Имя</Label>
          <Input
            id="firstName"
            autoFocus
            value={firstName}
            onChange={(e) => updateRegistration({ firstName: e.target.value })}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Фамилия</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => updateRegistration({ lastName: e.target.value })}
            className="h-12 text-base"
          />
        </div>
      </div>
    </ScreenShell>
  );
}
