'use client';
import { SavedAttempts } from '@/components/app/SavedAttempts';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { LEARNING_COPY as C } from '@/config/integration';
import { historyResource } from '@/lib/learning-resources';
export default function HistoryPage() {
  return (
    <ScreenShell bottomNavigation scrollPage>
      <ScreenHeading variant="app" title={C.history} />
      <SavedAttempts resource={historyResource} history />
    </ScreenShell>
  );
}
