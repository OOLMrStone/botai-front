'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';
import { useRegisterFlow } from '@/hooks/use-flow-navigation';
import { AGE_LIMITS, isValidAge } from '@/lib/validation';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function AgePage() {
  const { goNext } = useRegisterFlow('age');
  const age = useOnboardingStore((s) => s.registration.age);
  const updateRegistration = useOnboardingStore((s) => s.updateRegistration);

  const valid = isValidAge(age);

  return (
    <ScreenShell
      footer={
        <Button
          className="h-12 w-full text-base"
          size="lg"
          disabled={!valid}
          onClick={() => goNext()}
        >
          {COPY.register.age.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.register.age.title} />

      <div className="space-y-2">
        <Label htmlFor="age">Возраст</Label>
        <Input
          id="age"
          type="number"
          inputMode="numeric"
          min={AGE_LIMITS.min}
          max={AGE_LIMITS.max}
          autoFocus
          value={age}
          onChange={(e) => updateRegistration({ age: e.target.value })}
          className="h-12 text-base"
        />
      </div>
    </ScreenShell>
  );
}
