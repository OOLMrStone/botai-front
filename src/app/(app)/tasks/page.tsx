import { MascotPlaceholder } from '@/components/onboarding/MascotPlaceholder';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { COPY } from '@/config/onboarding-steps';

// Вкладка «Задачи» - заглушка. Реальные задачи ждут решения по структуре (#8).
export default function TasksPage() {
  return (
    <ScreenShell center>
      <MascotPlaceholder />
      <ScreenHeading title={COPY.tasks.title} subtitle={COPY.tasks.subtitle} />
    </ScreenShell>
  );
}
