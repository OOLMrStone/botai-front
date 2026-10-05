import { Button } from '@/components/ui/button';

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
      <div className={layout.training.reviewHeader}>
        <h2 className={layout.training.reviewTitle}>
          {missing.length ? TASK_COPY.review.missing : TASK_COPY.review.complete}
        </h2>
        <p className={layout.training.reviewStat}>
          {TASK_COPY.review.answered(taskCount - missing.length, taskCount)}
        </p>
      </div>
      {missing.length ? (
        <div className={layout.training.reviewList}>
          {missing.map((index) => (
            <Button
              key={index}
              variant="outline"
              className={layout.training.reviewTask}
              aria-label={TASK_COPY.review.openTask(index + 1)}
              onClick={() => onSelect(index)}
            >
              {TASK_COPY.review.task(index + 1)}
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
