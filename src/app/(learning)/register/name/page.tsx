'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ValidatedField } from '@/components/onboarding/ValidatedField';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import { useRegisterFlow } from '@/hooks/use-flow-navigation';
import { isValidName } from '@/lib/validation';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function NamePage() {
  const { goNext } = useRegisterFlow('name');
  const { firstName, lastName } = useOnboardingStore((s) => s.registration);
  const updateRegistration = useOnboardingStore((s) => s.updateRegistration);

  const valid = isValidName(firstName) && isValidName(lastName);

  return (
    <ScreenShell
      footer={
        <Button className={layout.cta} size="default" disabled={!valid} onClick={() => goNext()}>
          {COPY.register.name.action}
        </Button>
      }
    >
      <ScreenHeading title={COPY.register.name.title} />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Имя</Label>
          <ValidatedField
            id="firstName"
            autoFocus
            value={firstName}
            onChange={(value) => updateRegistration({ firstName: value })}
            validate={isValidName}
            errorText={COPY.validation.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Фамилия</Label>
          <ValidatedField
            id="lastName"
            value={lastName}
            onChange={(value) => updateRegistration({ lastName: value })}
            validate={isValidName}
            errorText={COPY.validation.name}
          />
        </div>
      </div>
    </ScreenShell>
  );
}
