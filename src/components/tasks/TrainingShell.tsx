'use client';
import Image from 'next/image';
import { X, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskStatusScrubber } from '@/components/tasks/TaskStatusScrubber';
import { TrainingControls } from '@/components/tasks/TrainingControls';
import { TrainingReview } from '@/components/tasks/TrainingReview';
import { TrainingTaskCard } from '@/components/tasks/TrainingTaskCard';
import { AttemptFeedback } from '@/components/tasks/AttemptFeedback';
import { ErrorNote } from '@/components/common/ErrorNote';
import { MockExamAttachments } from '@/components/mock-exams/MockExamAttachments';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { TASK_COPY } from '@/config/tasks';
import { LEARNING_COPY as C, INTEGRATION } from '@/config/integration';
import { useTrainingShell } from '@/hooks/use-training-shell';
import { itemLocked } from '@/lib/attempt';
import { cn } from '@/lib/utils';
export function TrainingShell({ attemptId }: { attemptId: string }) {
  const training = useTrainingShell(attemptId);
  const { attempt, item } = training;
  if (!attempt)
    return (
      <div className={layout.training.shell}>
        <div className={layout.training.cardArea}>
          {training.error ? (
            <ErrorNote message={training.error} onRetry={() => void training.retry()} />
          ) : (
            <p className={layout.typography.description}>{C.loading}</p>
          )}
        </div>
      </div>
    );
  const locked = item ? itemLocked(item) : false;
  const solution = item ? training.solutions[item.id] : undefined;
  return (
    <div className={cn(layout.training.shell, layout.viewport.width)}>
      <header className={layout.training.header}>
        <div className={layout.training.headerRow}>
          <Button
            variant="ghost"
            size="icon-compact"
            className={layout.training.closeButton}
            aria-label={TASK_COPY.training.exit}
            disabled={training.busy}
            onClick={() => void training.exit()}
          >
            <X className={layout.training.actionIcon} />
          </Button>
          <div className={layout.training.scrubber}>
            <TaskStatusScrubber
              taskIds={attempt.items.map((item) => item.id)}
              answeredTaskIds={training.answeredTaskIds}
              statuses={training.statuses}
              currentIndex={Math.min(training.currentIndex, attempt.items.length - 1)}
              reviewActive={training.review}
              onSelect={(index) => void training.select(index)}
              onReview={() => void training.select(training.reviewIndex)}
            />
          </div>
        </div>
      </header>
      <div className={layout.integration.summary}>
        <span className={layout.typography.caption}>
          {training.busy ? C.saving : training.unsaved ? C.unsaved : C.saved}
        </span>
        <span className={layout.typography.caption}>
          {C.checked(attempt.summary.graded, attempt.summary.total)} ·{' '}
          {C.score(attempt.summary.earnedPoints, attempt.summary.maxPoints)}
        </span>
      </div>
      {training.error ? (
        <ErrorNote
          message={training.error}
          retryLabel={training.conflict ? C.reload : C.retry}
          onRetry={() => void (training.conflict ? training.reload() : training.retry())}
        />
      ) : null}
      {training.revealError ? <ErrorNote message={training.revealError} /> : null}
      <main className={layout.training.cardArea}>
        {training.review ? (
          <TrainingReview
            taskCount={attempt.items.length}
            missing={training.missing}
            onSelect={(index) => void training.select(index)}
          />
        ) : item ? (
          <TrainingTaskCard
            key={item.id}
            task={item.task}
            drawingKey={item.id}
            isFavourite={item.task.isFavourite}
            position={training.currentIndex + 1}
            status={training.statuses[item.id]}
            locked={locked}
            solutionRevealed={training.revealed.includes(item.id)}
            canReveal={Boolean(item.result?.isGraded || item.submission?.result?.isGraded)}
            solution={
              solution
                ? [
                    { type: 'text', value: `${C.referenceAnswer}: ${solution.referenceAnswer}` },
                    ...(solution.referenceSolution
                      ? [{ type: 'text' as const, value: solution.referenceSolution }]
                      : []),
                  ]
                : []
            }
            onToggleSolution={() => void training.toggleSolution(item.id)}
          />
        ) : null}
      </main>
      {item && !training.review ? (
        <>
          {item.task.isDemo ? <p className={layout.typography.caption}>{C.demo}</p> : null}
          {item.task.responseType === 'photo' && item.task.gradingCapability !== 'available' ? (
            <p className={layout.typography.description}>
              {item.task.gradingCapability === 'unsupported' ? C.unsupported : C.gradingUnavailable}
            </p>
          ) : null}
          {item.submission?.images.length ? (
            <div className={layout.integration.photos}>
              {item.submission.images.map((image) => (
                <div key={image.id} className={layout.integration.photo}>
                  <a href={image.previewUrl} target="_blank" rel="noreferrer">
                    <Image
                      width={80}
                      height={80}
                      src={image.previewUrl}
                      alt={image.fileName}
                      className={layout.integration.preview}
                    />
                  </a>
                  <Button
                    variant="ghost"
                    size="compact"
                    disabled={locked || training.busy || item.submission?.status !== 'draft'}
                    onClick={() => void training.removeImage(item.submission!.id, image.id)}
                  >
                    {C.removePhoto}
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
          <AttemptFeedback
            item={item}
            busy={training.busy}
            onCancel={() => item.submission && void training.cancel(item.submission.id)}
            onRetry={() => void training.retrySubmission(item.id)}
          />
        </>
      ) : null}
      <footer className={cn(layout.training.controls, layout.training.controlsRow)}>
        {training.review || item?.task.responseType === 'short' ? (
          <TrainingControls
            session={{
              id: attempt.id,
              taskIds: attempt.items.map((item) => item.id),
              currentIndex: training.currentIndex,
              answers: Object.fromEntries(
                attempt.items.map((item) => [item.id, training.answers[item.id] ?? item.answer]),
              ),
              statuses: training.statuses,
              revealedSolutions: training.revealed,
              source: 'catalog',
            }}
            taskId={item?.id}
            taskCount={attempt.items.length}
            review={training.review}
            reviewIndex={training.reviewIndex}
            status={item ? training.statuses[item.id] : 'unverified'}
            unverified={attempt.status !== 'completed'}
            allCorrect={attempt.status === 'completed'}
            busy={training.busy}
            editingBusy={training.editingBusy}
            locked={locked}
            onSelect={(index) => void training.select(index)}
            onAnswer={training.setAnswer}
            onCheck={() => void training.check()}
            onContinue={() => void training.exit()}
          />
        ) : item ? (
          <>
            <Button
              variant="outline"
              size="icon"
              className={layout.training.controlButton}
              aria-label={TASK_COPY.training.previous}
              disabled={training.currentIndex === 0 || training.busy}
              onClick={() => void training.select(training.currentIndex - 1)}
            >
              <ChevronLeft />
            </Button>
            <MockExamAttachments
              onAdd={(files) => void training.upload(item.id, files)}
              disabled={
                locked ||
                training.busy ||
                Boolean(item.submission && item.submission.status !== 'draft')
              }
              label={training.busy ? C.uploading : C.photo}
              accept={INTEGRATION.imageAccept}
            />
            <Button
              variant="outline"
              size="icon"
              className={layout.training.controlButton}
              aria-label={TASK_COPY.training.next}
              disabled={training.busy}
              onClick={() => void training.select(training.currentIndex + 1)}
            >
              {training.currentIndex === attempt.items.length - 1 ? (
                <CheckCheck />
              ) : (
                <ChevronRight />
              )}
            </Button>
          </>
        ) : null}
      </footer>
    </div>
  );
}
