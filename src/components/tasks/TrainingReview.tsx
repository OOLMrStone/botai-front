import { ChevronRight } from 'lucide-react';

import { layout } from '@/config/layout';
import { TASK_COPY } from '@/config/tasks';
import { cn } from '@/lib/utils';

interface TrainingReviewProps {
  taskCount: number;
  missing: number[];
  onSelect: (index: number) => void;
}

export function TrainingReview({ taskCount, missing, onSelect }: TrainingReviewProps) {
  return (
    <section className={cn(layout.training.card, layout.training.reviewCard)}>
      <h2 className={layout.training.cardTitle}>{TASK_COPY.review.title}</h2>
      <div className={layout.training.reviewStats}>
        <p className={layout.training.reviewStat}>
          {TASK_COPY.review.answered(taskCount - missing.length)}
        </p>
        <p className={layout.training.reviewStat}>
          {missing.length ? TASK_COPY.review.missing(missing.length) : TASK_COPY.review.complete}
        </p>
      </div>
      {missing.length ? (
        <div className={layout.training.reviewList}>
          {missing.map((index) => (
            <button
              key={index}
              type="button"
              className={cn(layout.training.reviewTask, layout.focusRing)}
              aria-label={TASK_COPY.review.openTask(index + 1)}
              onClick={() => onSelect(index)}
            >
              <span className={layout.training.reviewTaskText}>
                <span className={layout.training.reviewTaskTitle}>
                  {TASK_COPY.review.task(index + 1)}
                </span>
                <span className={layout.training.reviewTaskStatus}>
                  {TASK_COPY.review.unanswered}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className={layout.training.reviewTaskIcon} />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
