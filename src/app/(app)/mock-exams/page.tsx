import { MockExamCatalog } from '@/components/mock-exams/MockExamCatalog';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { ScreenShell } from '@/components/onboarding/ScreenShell';
import { MOCK_EXAMS, MOCK_EXAM_COPY, MOCK_EXAM_LAYOUT } from '@/config/mock-exams';

export default function MockExamsPage() {
  return (
    <ScreenShell className={MOCK_EXAM_LAYOUT.page}>
      <ScreenHeading title={MOCK_EXAM_COPY.title} subtitle={MOCK_EXAM_COPY.subtitle} />
      <MockExamCatalog exams={MOCK_EXAMS} />
    </ScreenShell>
  );
}
