'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ValidatedField } from '@/components/onboarding/ValidatedField';
import { layout } from '@/config/layout';
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
        <Button className={layout.cta} size="default" disabled={!valid} onClick={() => goNext()}>
          {COPY.register.age.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.register.age.title} />

      <div className="space-y-2">
        <Label htmlFor="age">Возраст</Label>
        <ValidatedField
          id="age"
          type="number"
          inputMode="numeric"
          min={AGE_LIMITS.min}
          max={AGE_LIMITS.max}
          autoFocus
          value={age}
          onChange={(value) => updateRegistration({ age: value })}
          validate={isValidAge}
          errorText={COPY.validation.age}
        />
      </div>
    </ScreenShell>
  );
}
