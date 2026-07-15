'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';
import { useRegisterFlow } from '@/hooks/use-flow-navigation';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function NamePage() {
  const { goNext } = useRegisterFlow('name');
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
          onClick={() => goNext()}
        >
          {COPY.register.name.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.register.name.title} />

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
