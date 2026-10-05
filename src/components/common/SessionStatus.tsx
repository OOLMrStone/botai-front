'use client';

import { ErrorNote } from '@/components/common/ErrorNote';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { layout } from '@/config/layout';
import { COPY } from '@/config/onboarding-steps';
import type { AuthStatus } from '@/stores/auth-store';

export function SessionStatus({ status, retry }: { status: AuthStatus; retry: () => void }) {
  return (
    <ScreenShell center>
      {status === 'error' ? (
        <ErrorNote message={COPY.errors.session} onRetry={retry} />
      ) : (
        <p role="status" className={layout.typography.description}>
          {COPY.profile.loading}
        </p>
      )}
    </ScreenShell>
  );
}
