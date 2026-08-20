import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';

export default function MockExamsPage() {
  return (
    <ScreenShell center>
      <MascotPlaceholder />
      <ScreenHeading title={COPY.mockExams.title} subtitle={COPY.mockExams.subtitle} />
    </ScreenShell>
  );
}
