'use client';
import { useEmailVerification } from '@/hooks/use-email-verification';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ErrorNote } from '@/components/common/ErrorNote';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { LEARNING_COPY as C } from '@/config/integration';
export function VerifyEmailExperience() {
  const state = useEmailVerification();
  return (
    <ScreenShell>
      <ScreenHeading title={C.verifyTitle} />
      {state.done ? (
        <p>{C.verified}</p>
      ) : (
        <Button
          className={layout.cta}
          disabled={!state.token || state.pending}
          onClick={() => void state.confirm()}
        >
          {C.verifyAction}
        </Button>
      )}
      {state.error ? <ErrorNote message={state.error} /> : null}
    </ScreenShell>
  );
}
