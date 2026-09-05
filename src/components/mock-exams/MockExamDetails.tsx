import { DialogSheet } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MOCK_EXAM_COPY, MOCK_EXAM_LAYOUT, type MockExam } from '@/config/mock-exams';
import { cn } from '@/lib/utils';
import type { MockExamResult } from '@/stores/mock-exams-store';

interface MockExamDetailsProps {
  exam: MockExam | undefined;
  result: MockExamResult | undefined;
  onClose: () => void;
  onView: () => void;
}

export function MockExamDetails({ exam, result, onClose, onView }: MockExamDetailsProps) {
  if (!exam || !result) return null;

  return (
    <DialogSheet
      open
      title={exam.title}
      closeLabel={MOCK_EXAM_COPY.detailsClose}
      className={MOCK_EXAM_LAYOUT.details}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className={MOCK_EXAM_LAYOUT.detailsGrid}>
        <div className={MOCK_EXAM_LAYOUT.detailsMetric}>
          <p className={MOCK_EXAM_LAYOUT.detailsLabel}>{MOCK_EXAM_COPY.detailsResult}</p>
          <p className={MOCK_EXAM_LAYOUT.detailsValue}>{MOCK_EXAM_COPY.score(result.score)}</p>
        </div>
        <div className={MOCK_EXAM_LAYOUT.detailsMetric}>
          <p className={MOCK_EXAM_LAYOUT.detailsLabel}>{MOCK_EXAM_COPY.detailsDate}</p>
          <p className={MOCK_EXAM_LAYOUT.detailsValue}>{exam.dateLabel}</p>
        </div>
        <div className={cn(MOCK_EXAM_LAYOUT.detailsMetric, MOCK_EXAM_LAYOUT.detailsTaskMetric)}>
          <p className={MOCK_EXAM_LAYOUT.detailsLabel}>{MOCK_EXAM_COPY.detailsTasks}</p>
          <p className={MOCK_EXAM_LAYOUT.detailsValue}>{exam.tasks.length}</p>
        </div>
      </div>
      <Button className={MOCK_EXAM_LAYOUT.detailsAction} onClick={onView}>
        {MOCK_EXAM_COPY.view}
      </Button>
    </DialogSheet>
  );
}
