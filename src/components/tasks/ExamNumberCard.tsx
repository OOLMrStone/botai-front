import { Check } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { layout } from '@/config/layout';
import { TASK_COPY } from '@/config/tasks';
import { LEARNING_COPY as C } from '@/config/integration';
import type { CatalogNumber, Task } from '@/lib/api/learning-types';
import { cn } from '@/lib/utils';

interface Props {
  number: CatalogNumber;
  tasks: Task[];
  onOpen: () => void;
}

export function ExamNumberCard({ number, tasks, onOpen }: Props) {
  const active = number.availableCount > 0;
  const progress = number.availableCount
    ? Math.round(
        (tasks.filter((task) => task.progressStatus === 'solved').length / number.availableCount) *
          100,
      )
    : 0;

  return (
    <button
      type="button"
      data-exam-number={number.examNumber}
      disabled={!active}
      className={cn(
        layout.tasks.card,
        layout.tasks.compactCard,
        active ? layout.tasks.activeCard : layout.tasks.disabledCard,
        layout.focusRing,
      )}
      onClick={onOpen}
    >
      <span className={layout.tasks.numberHeaderGrid}>
        <span className={layout.tasks.numberLabel}>
          {TASK_COPY.examNumberPrefix}
          {number.examNumber}
        </span>
        <span className={cn(layout.tasks.numberHeadingTitle, layout.tasks.numberTitleCompact)}>
          {number.title}
        </span>
        {active && progress === 100 ? (
          <span className={layout.tasks.numberHeaderMeta}>
            <Check className={layout.tasks.icon} />
          </span>
        ) : null}
        {active ? (
          <>
            <span className={layout.tasks.compactMetricValue}>
              {C.available(number.availableCount)}
            </span>
            <Progress value={progress} className={layout.tasks.compactProgress} />
          </>
        ) : (
          <span className={layout.tasks.soon}>{TASK_COPY.soon}</span>
        )}
      </span>
    </button>
  );
}
