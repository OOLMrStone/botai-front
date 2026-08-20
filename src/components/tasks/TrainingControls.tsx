import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ValidatedInput } from '@/components/ui/validated-input';
import { layout } from '@/config/layout';
import { TASK_ANSWER_INPUT_ID, TASK_COPY, type TaskStatus } from '@/config/tasks';
import type { TrainingSession } from '@/stores/tasks-store';

interface TrainingControlsProps {
  session: TrainingSession;
  taskId: string | undefined;
  taskCount: number;
  review: boolean;
  reviewIndex: number;
  status: TaskStatus;
  unverified: boolean;
  allCorrect: boolean;
  onSelect: (index: number) => void;
  onAnswer: (taskId: string, answer: string) => void;
  onCheck: () => void;
  onContinue: () => void;
}

export function TrainingControls({
  session,
  taskId,
  taskCount,
  review,
  reviewIndex,
  status,
  unverified,
  allCorrect,
  onSelect,
  onAnswer,
  onCheck,
  onContinue,
}: TrainingControlsProps) {
  if (review) {
    return (
      <div className={layout.training.reviewActions}>
        <Button className={layout.cta} disabled={!unverified} onClick={onCheck}>
          {TASK_COPY.review.check}
        </Button>
        <Button
          className={layout.cta}
          variant={allCorrect ? 'default' : 'outline'}
          onClick={onContinue}
        >
          {TASK_COPY.review.continue}
        </Button>
      </div>
    );
  }

  if (!taskId) return null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={layout.training.controlButton}
        aria-label={TASK_COPY.training.previous}
        disabled={session.currentIndex === 0}
        onClick={() => onSelect(session.currentIndex - 1)}
      >
        <ChevronLeft />
      </Button>
      <div className={layout.training.answerWrap}>
        <ValidatedInput
          id={TASK_ANSWER_INPUT_ID}
          inputMode="decimal"
          value={session.answers[taskId] ?? ''}
          validationState={
            status === 'correct' ? 'success' : status === 'incorrect' ? 'error' : 'neutral'
          }
          className={layout.training.answer}
          placeholder={TASK_COPY.training.answer}
          onChange={(event) => onAnswer(taskId, event.target.value)}
        />
      </div>
      {session.currentIndex === taskCount - 1 ? (
        <Button className={layout.training.reviewButton} onClick={() => onSelect(reviewIndex)}>
          {TASK_COPY.training.toReview}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className={layout.training.controlButton}
          aria-label={TASK_COPY.training.next}
          onClick={() => onSelect(session.currentIndex + 1)}
        >
          <ChevronRight />
        </Button>
      )}
    </>
  );
}
